"use client";

import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function HomePage() {
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <textarea
          placeholder="enter your question"
          onChange={(e: any) => setPrompt(e?.target?.value)}
        />
        <button onClick={submitResponse}>Send</button>
        {response && (
          <>
            {" "}
            <div>Response</div>
            <div> {response || ""}</div>
          </>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
