"use client";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

const BlogGenerator = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: "/api/generate-blog" });

  console.log("messages", messages);
  return (
    <div>
      <h2>Blog Generator</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleInputChange}
          placeholder="enter your blog topic here"
          value={input}
        />
        <button>{isLoading ? "Generating..." : "Generate blog post"}</button>
      </form>
      <div>
        {messages ? (
          <ReactMarkdown>{messages}</ReactMarkdown>
        ) : (
          <p>Your blog post will be generated here</p>
        )}
      </div>
    </div>
  );
};

export default BlogGenerator;
