import simpleGit from "simple-git";
import path from "path";
import os from "os";

export async function POST(req: Request) {
  try {
    // 1. Extract the correct key sent from the frontend
    const { gitHubUrl } = await req.json();

    if (!gitHubUrl) {
      return new Response(JSON.stringify({ error: "Missing gitHubUrl" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Create a unique temporary folder in the /tmp directory 
    // to avoid read-only filesystem errors and directory collisions
    const tempFolder = path.join(os.tmpdir(), `repo-${Date.now()}`);

    // 3. Await the clone operation directly. 
    // This forces the server to wait until the clone is 100% finished.
    await simpleGit().clone(gitHubUrl, tempFolder);
    
    console.log(`Repository cloned successfully to ${tempFolder}!`);

    // 4. Return success AFTER the clone completes
    return new Response(JSON.stringify({ message: "Clone successful" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    // 5. Catch any errors during the await and properly return a 500 status
    console.error("Error cloning repository:", err);
    return new Response(JSON.stringify({ error: "Error cloning repository" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" } 
    });
  }
}