"use client";

import { useCompletion } from "@ai-sdk/react";

export default function Migrate() {
  const {
    completion,
    input,
    handleInputChange,
    complete, // <-- Extract 'complete' instead of 'handleSubmit'
    isLoading,
    error,
  } = useCompletion({
    api: "/api/migrate/clone",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    // 'complete' takes the prompt string as arg 1, and options as arg 2
    complete(input, {
      body: { gitHubUrl: input },
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Point the form to our custom onSubmit function */}
      <form 
        onSubmit={onSubmit} 
        className="flex justify-between w-full gap-2"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="GitHub URL"
          className="border p-2 rounded flex-1"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={isLoading || !input}
        >
          {isLoading ? "Migrating..." : "Migrate"}
        </button>
      </form>

      {(completion || error) && (
        <div className="outline p-3 rounded-md shadow-xl min-h-[50px]">
          {error ? <span className="text-red-500">{error.message}</span> : completion}
        </div>
      )}
    </div>
  );
}