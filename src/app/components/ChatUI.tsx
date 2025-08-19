"use client";

import { SendHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatUI() {
  const [response, setResponse] = useState<any>();
  const [prompt, setPrompt] = useState();

  const submitResponse = async () => {
    setResponse("");
    const res: any = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ prompt }),
    });

    const reader = await res?.body?.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader!.read();

      if (done) break;
      setResponse((prev: any) => prev + decoder.decode(value) || "");
    }
  };
  return (
    <div>
      <div className="flex justify-between w-full gap-2">
        <textarea
          placeholder="enter your question"
          onChange={(e: any) => setPrompt(e?.target?.value)}
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
            {response || ""}
          </div>
        </>
      )}
    </div>
  );
}
