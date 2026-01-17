"use client";

import { useCompletion } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";

const Search = () => {
  const {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    complete,
    error,
    completion,
  } = useCompletion({
    api: "/api/search",
    streamProtocol: "text",
  });

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Search"
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
          {isLoading ? "Searching..." : "Go"}
        </button>
      </form>

      {error && <p className="text-red-500">{error.message}</p>}

      <div className="prose">
        {completion ? <ReactMarkdown>{completion}</ReactMarkdown> : <p></p>}
      </div>
    </div>
  );
};

export default Search;
