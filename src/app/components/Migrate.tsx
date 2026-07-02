"use client";

import { useState } from "react";

import CountUp from "react-countup";

// 1. Define the TypeScript interface matching your backend stats shape
// interface RepoStats {
//   totalFiles: Record<string, Record<string, number>>;
//   components: Record<string, Record<string, number>>;
//   hooks: Record<string, Record<string, number>>;
//   apiRoutes: Record<string, Record<string, number>>;
//   tests: Record<string, Record<string, number>>;
//   configFiles: Record<string, Record<string, number>>;
// }

// interface MetricsStats {
//   averageComponentSize: Record<string, Record<string, number>>;
//   numberOfUseEffects: Record<string, Record<string, number>>;
//   maxComponentSize: Record<string, Record<string, number>>;
//   contextProviders: Record<string, Record<string, number>>;
// }

interface RenderGridProps {
  cardsObject: Record<string, Record<string, number>> | null;
  heading: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RenderGrid = ({ cardsObject, heading }: RenderGridProps) => {
  if (!cardsObject) return null;
  return (
    <>
      {cardsObject && (
        <h3 className="font-bold text-lg border-b pb-4">{heading}</h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 text-sm pt-4">
        {Object.entries(cardsObject)?.map(([key, value]) => {
          return (
            <div
              key={key}
              className="border p-6 rounded-md shadow-md bg-white flex flex-col gap-2"
            >
              <div className="font-bold ">{Object?.keys(value)?.[0] || 0}</div>
              <CountUp
                className=" text-6xl !text-right"
                end={(Object?.values(value)?.[0] as number) || 0}
                duration={2.0} // Time in seconds for animation to complete
                separator="," // Adds comma for thousands (e.g., 1,250)
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default function Migrate() {
  // 2. Track traditional loading, error, and stats state manually
  const [stats, setStats] = useState<Record<
    string,
    Record<string, number>
  > | null>(null);
  const [metrics, setMetrics] = useState<Record<
    string,
    Record<string, number>
  > | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    setIsLoading(true);
    setError(null);
    setStats(null);
    setMetrics(null);

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
      setStats(data?.stats);
      setMetrics(data?.metrics);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gap-4 flex flex-col max-full w-full mx-auto p-4">
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

      {/* 6. Render the calculated stats cleanly once they arrive */}
      {stats && !isLoading && !error && (
        <RenderGrid cardsObject={stats} heading=" Repository Audit Results" />
      )}

      {metrics && !isLoading && !error && (
        <RenderGrid cardsObject={metrics} heading="Metrics" />
      )}
    </div>
  );
}
