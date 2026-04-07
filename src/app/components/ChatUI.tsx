"use client";

import { SendHorizontal } from "lucide-react";
import { useState, ChangeEvent } from "react";

export default function ChatUI() {
  const [response, setResponse] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  const submitResponse = async () => {
    setResponse("");
    const res = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setResponse(`Error: ${errorData.error || "Something went wrong"}`);
      return;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader!.read();

      if (done) break;
      setResponse((prev) => prev + decoder.decode(value) || "");
    }
  };

  return (
    <div>
      <div className="flex justify-between w-full gap-2">
        <textarea
          placeholder="enter your question"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          className="resize-none w-full p-3"
        />
        <button onClick={submitResponse}>
          <SendHorizontal />
        </button>
      </div>

      {response && (
        <>
          {" "}
          {/* <div>Response</div> */}
          <div className="outline p-3 rounded-md shadow-xl">
            {" "}
            {response}
          </div>
        </>
      )}
    </div>
  );
}
