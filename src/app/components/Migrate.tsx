"use client";

import { useState } from "react";

import CountUp from "react-countup";

// 1. Define the TypeScript interface matching your backend stats shape
interface RepoStats {
  totalFiles: Record<string, number>;
  components: Record<string, number>;
  hooks: Record<string, number>;
  apiRoutes: Record<string, number>;
  tests: Record<string, number>;
  configFiles: Record<string, number>;
}

export default function Migrate() {
  // 2. Track traditional loading, error, and stats state manually
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    setIsLoading(true);
    setError(null);
    setStats(null);

    try {
      // 3. Make a standard HTTP POST request to your API route
      const response = await fetch("/api/migrate/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gitHubUrl: input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      // 4. Store the returned stats in your React state
      setStats(data.stats);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-full w-full mx-auto p-4">
      <form onSubmit={onSubmit} className="flex justify-between w-full gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="GitHub URL"
          className="border p-2 rounded flex-1"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={isLoading || !input}
        >
          {isLoading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {/* 5. Handle Error Displays */}
      {error && (
        <div className="border border-red-500 bg-red-50 p-3 rounded-md text-red-500">
          <strong>Error:</strong> {error}
        </div>
      )}
      {stats && (
        <h3 className="font-bold text-lg border-b pb-1">
          Repository Audit Results
        </h3>
      )}
      {/* 6. Render the calculated stats cleanly once they arrive */}
      {stats && !isLoading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
          {Object.entries(stats)?.map(([key, value]) => {
            return (
              <div
                key={key}
                className="border p-4 rounded-md shadow-md bg-white flex flex-col gap-2"
              >
                <div className="font-bold ">
                  {Object?.keys(value)?.[0] || 0}
                </div>
                <CountUp
                  className=" text-6xl"
                  end={(Object?.values(value)?.[0] as number) || 0}
                  duration={2.0} // Time in seconds for animation to complete
                  separator="," // Adds comma for thousands (e.g., 1,250)
                />
              </div>
            );
          })}
        </div>
      )}
      {/* {stats && (
        <div className="border p-4 rounded-md shadow-md space-y-2 bg-white">
          <h3 className="font-bold text-lg border-b pb-1">
            Repository Audit Results
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Total Files:</div>
            <div className="font-mono font-bold">{stats.totalFiles}</div>
            <div>React Components:</div>
            <div className="font-mono font-bold text-blue-600">
              {stats.components}
            </div>
            <div>Custom Hooks:</div>
            <div className="font-mono font-bold text-purple-600">
              {stats.hooks}
            </div>
            <div>API Routes:</div>
            <div className="font-mono font-bold text-green-600">
              {stats.apiRoutes}
            </div>
            <div>Test Files:</div>
            <div className="font-mono font-bold text-orange-600">
              {stats.tests}
            </div>
            <div>Config Files:</div>
            <div className="font-mono font-bold text-gray-600">
              {stats.configFiles}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
