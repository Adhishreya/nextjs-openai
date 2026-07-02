import simpleGit from "simple-git";
import path from "path";
import os from "os";
import { Project, SyntaxKind, Node as TsMorphNode } from "ts-morph";

interface RepoStats {
  totalFiles: number;
  components: number;
  hooks: number;
  apiRoutes: number;
  tests: number;
  configFiles: number;
}

interface Metrics {
  averageComponentSize: number;
  numberOfUseEffects: number;
  maxComponentSize: number;
  contextProviders: number;
}

const fileKeys = {
  totalFiles: "Total Files",
  components: "Components",
  hooks: "Hooks",
  apiRoutes: "API Routes",
  tests: "Tests",
  configFiles: "Config Files",
  averageComponentSize: "Avg Component Size",
  numberOfUseEffects: "Number of UseEffects",
  maxComponentSize: "Max Component Size",
  contextProviders: "Context Providers",
};

export async function POST(req: Request) {
  try {
    // 1. Extract the correct key sent from the frontend
    const { gitHubUrl } = await req.json();

    if (!gitHubUrl) {
      return new Response(JSON.stringify({ error: "Missing gitHubUrl" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Create a unique temporary folder in the /tmp directory
    // to avoid read-only filesystem errors and directory collisions
    const tempFolder = path.join(os.tmpdir(), `repo-${Date.now()}`);

    // 3. Await the clone operation directly.
    // This forces the server to wait until the clone is 100% finished.
    await simpleGit().clone(gitHubUrl, tempFolder);

    const project = new Project();

    project.addSourceFilesAtPaths(
      `${tempFolder}/**/*.{ts,tsx,js,jsx,json,mjs,cjs}`
    );

    const sourceFiles = project.getSourceFiles();

    const stats: RepoStats = {
      totalFiles: sourceFiles.length,
      components: 0,
      hooks: 0,
      apiRoutes: 0,
      tests: 0,
      configFiles: 0,
    };

    const metrics: Metrics = {
      averageComponentSize: 0,
      numberOfUseEffects: 0,
      maxComponentSize: 0,
      contextProviders: 0,
    };

    let totalComponentLines = 0;

    sourceFiles.forEach((sourceFile) => {
      const filePath = sourceFile.getFilePath().toLowerCase();

      // ==========================================
      // 1. FILE-PATH MATCHING (Configs, Tests, APIs)
      // ==========================================

      // Check for Config files (next.config.js, tailwind.config.ts, package.json, etc.)
      if (
        filePath.includes(".config.") ||
        filePath.endsWith("package.json") ||
        filePath.endsWith("tsconfig.json")
      ) {
        stats.configFiles++;
        return; // Skip deep AST parsing for configs
      }

      // Check for Test files (*.test.ts, *.spec.tsx, or inside a __tests__ folder)
      if (
        filePath.includes(".test.") ||
        filePath.includes(".spec.") ||
        filePath.includes("/__tests__/")
      ) {
        stats.tests++;
        return; // Skip deep AST parsing for tests
      }

      // Check for API Routes (Next.js Pages API or App Router API)
      if (filePath.includes("/pages/api/") || filePath.includes("/app/api/")) {
        stats.apiRoutes++;
        // We don't return here, in case they oddly put components in their API folder!
      }

      const callExpressions = sourceFile.getDescendantsOfKind(
        SyntaxKind.CallExpression
      );
      callExpressions.forEach((call) => {
        if (call.getExpression().getText() === "useEffect") {
          metrics.numberOfUseEffects++;
        }
      });

      // ==========================================
      // 2. AST STRUCTURAL MATCHING (Components & Hooks)
      // ==========================================

      // Grab all standard functions and arrow functions
      const functions = [
        ...sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration),
        ...sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction),
      ];

      functions.forEach((func) => {
        // Get the name of the function (if it has one)
        let funcName = "";
        if (TsMorphNode.isFunctionDeclaration(func)) {
          // `func` is safely narrowed to a FunctionDeclaration here
          funcName = func.getName() || "";
        } else {
          // Grab the parent ONLY if it's a variable declaration (e.g., const myComponent = ...)
          const parentVar = func.getParentIfKind(
            SyntaxKind.VariableDeclaration
          );

          if (parentVar) {
            // `parentVar` is now strictly typed as a VariableDeclaration, so getName() is safe
            funcName = parentVar.getName();
          }
        }

        // --- Component Check ---
        // A function is likely a component if it returns JSX and is PascalCased
        const returnsJSX =
          func.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 ||
          func.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length >
            0;

        const isPascalCase =
          funcName.charAt(0) === funcName.charAt(0).toUpperCase() &&
          funcName.length > 1;

        if (returnsJSX && isPascalCase) {
          stats.components++;
          // Calculate Component Size in lines
          const startLine = func.getStartLineNumber();
          const endLine = func.getEndLineNumber();
          const componentLines = endLine - startLine + 1;

          totalComponentLines += componentLines;

          // Track Max Component Size
          if (componentLines > metrics.maxComponentSize) {
            metrics.maxComponentSize = componentLines;
          }
        }

        // --- Hook Check ---
        // A function is a custom hook if it starts with "use" and follows camelCase
        const isHook =
          funcName.startsWith("use") &&
          funcName.length > 3 &&
          funcName.charAt(3) === funcName.charAt(3).toUpperCase();

        if (isHook) {
          stats.hooks++;
        }
      });
    });

    metrics.averageComponentSize =
      stats.components > 0
        ? Math.round(totalComponentLines / stats.components)
        : 0;

    const displayStats: Record<string, Record<string, number>> = {};
    const displayMetrics: Record<string, Record<string, number>> = {};

    Object.entries(stats).forEach(([key, value]) => {
      if (value > 0)
        displayStats[key] = { [fileKeys[key as keyof RepoStats]]: value };
    });
    Object.entries(metrics).forEach(([key, value]) => {
      if (value > 0)
        displayMetrics[key] = { [fileKeys[key as keyof RepoStats]]: value };
    });

    // 4. Return success AFTER the clone completes
    return new Response(
      JSON.stringify({ stats: displayStats, metrics: displayMetrics }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    // 5. Catch any errors during the await and properly return a 500 status
    console.error("Error cloning repository:", err);
    return new Response(JSON.stringify({ error: "Error cloning repository" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
