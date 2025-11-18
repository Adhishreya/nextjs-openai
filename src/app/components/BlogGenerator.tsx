"use client";

import { useCompletion } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";

export default function BlogGenerator() {
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    complete,
  } = useCompletion({
    api: "/api/generate-blog",
    streamProtocol: "text",
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Blog Generator</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your blog topic"
          className="border p-2 rounded flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              complete(e.currentTarget.value);
            }
          }}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <p className="text-red-500">{error.message}</p>}

      <div className="prose">
        {completion ? (
          <ReactMarkdown>{completion}</ReactMarkdown>
        ) : (
          <p>Your blog post will appear here...</p>
        )}
      </div>
    </div>
  );
}
