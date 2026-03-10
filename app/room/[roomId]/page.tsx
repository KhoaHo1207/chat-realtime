"use client";

import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

function formatTimeRemaining(timeRemaining: number) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function Page() {
  const { roomId } = useParams<{ roomId: string }>();
  const { username } = useUsername();
  const [copyStatus, setCopyStatus] = useState<string>("COPY");
  const [timeRemaining] = useState<number | null>(121);
  const [message, setMessage] = useState<string>("");

  const messageref = useRef<HTMLInputElement>(null);

  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({
        query: {
          roomId,
        },
      });
      return res.data;
    },
  });
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await client.messages.post(
        {
          sender: username,
          text: text,
        },
        {
          query: {
            roomId: roomId as string,
          },
        },
      );
      setMessage("");
    },
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetchMessages();
      }
    },
  });
  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus("COPIED");
    setTimeout(() => {
      setCopyStatus("COPY");
    }, 2000);
  };

  console.log(messagesData);
  return (
    <main className="flex h-screen max-h-screen flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/30 p-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">Room ID</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-500">{roomId}</span>
              <button
                aria-label="Copy link"
                className="cursor-copy rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                onClick={copyLink}
              >
                {copyStatus}
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-800" />

          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 uppercase">
              Self-Destruct
            </span>
            <span
              className={`flex items-center gap-2 text-sm font-bold ${timeRemaining !== null && timeRemaining < 60 ? "text-red-500" : "text-amber-500"}`}
            >
              {timeRemaining !== null
                ? formatTimeRemaining(timeRemaining)
                : "--:--"}
            </span>
          </div>
        </div>

        <button
          className="group flex items-center gap-2 rounded bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-400 transition-all hover:bg-red-600 hover:text-white disabled:opacity-50"
          aria-label="Destroy now"
        >
          <span className="group-hover:animate-pulse">💣</span> DESTROY NOW
        </button>
      </header>

      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
        {messagesData && messagesData.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-zinc-600">
              No messages yet, start the conversation
            </p>
          </div>
        ) : (
          messagesData?.messages.map((message) => (
            <div
              key={message.id}
              className="flex flex-col items-start justify-center"
            >
              <div className="mb-1 flex items-baseline gap-3">
                <span
                  className={`text-xs font-bold ${message.sender === username ? "text-green-500" : "text-blue-500"}`}
                >
                  {message.sender === username ? "YOU" : message.sender}
                </span>

                <span className="text-[10px] text-zinc-600">
                  {format(message.timestamp, "HH:mm:ss")}
                </span>
              </div>

              <p className="text-sm leading-relaxed break-all text-zinc-300">
                {message.text}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-zinc-800 bg-zinc-900/30 p-4">
        <div className="flex gap-4">
          <div className="group relative flex-1">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 animate-pulse text-green-500">
              {">"}
            </span>
            <input
              autoFocus={true}
              type="text"
              className="w-full border border-zinc-800 bg-black py-3 pr-4 pl-8 text-sm text-zinc-100 transition-colors placeholder:text-zinc-700 focus:border-zinc-700 focus:outline-none"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={messageref}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim() !== "") {
                  e.preventDefault();
                  sendMessage({ text: message });
                  messageref.current?.focus();
                  setMessage("");
                }
              }}
            />
          </div>

          <button
            className="cursor-pointer bg-zinc-800 px-6 text-sm font-bold text-zinc-400 transition-all hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              sendMessage({ text: message });
              messageref.current?.focus();
              setMessage("");
            }}
            disabled={message.trim() === "" || isPending}
          >
            SEND
          </button>
        </div>
      </div>
    </main>
  );
}
