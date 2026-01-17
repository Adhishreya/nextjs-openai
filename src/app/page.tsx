"use client";

type ComponentKey = "search" | "blog";

import { SendHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import ChatUI from "./components/ChatUI";
import BlogGenerator from "./components/BlogGenerator";
import Search from "./components/Search";

export default function HomePage() {
  const [response, setResponse] = useState<any>();
  const [typeValue, setTypeValue] = useState<ComponentKey | null>(null);

  const componentToRender = {
    search: Search,
    blog: BlogGenerator,
    chat: ChatUI,
  };
  const userOptions = [
    { text: "Blog Generator", value: "blog" },
    { text: "Search ", value: "search" },
    { text: "Chat ", value: "chat" },
  ];

  const Component = typeValue ? componentToRender?.[typeValue ?? ""] : null;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        {/* <ChatUI /> */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-2">
            {userOptions?.map((option: any) => {
              return (
                <button
                  className="bg-black text-white px-4 py-2 rounded"
                  onClick={() => setTypeValue(option?.value)}
                >
                  {option?.text}
                </button>
              );
            })}
          </div>
          {Component && <Component />}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* <a
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
        </a> */}
      </footer>
    </div>
  );
}
