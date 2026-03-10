"use client";

import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Home() {
  const { username, setUsername } = useUsername();
  const router = useRouter();

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post();
      console.log(res);

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {">"}private_chat
          </h1>
          <p className="text-sm tracking-wide text-zinc-500">
            A priavte, self-destructing chat room.
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="" className="flex items-center text-zinc-500">
                Your identity
              </label>
              <div className="fle items-center gap-3">
                <div className="flex-1 border border-zinc-800 bg-zinc-950 p-3 font-mono text-sm text-zinc-400">
                  {username}
                </div>
              </div>
            </div>

            <button
              className="mt-2 w-full cursor-pointer bg-zinc-100 p-3 text-sm font-bold text-black transition-colors hover:bg-zinc-50 hover:text-black disabled:opacity-50"
              onClick={() => createRoom()}
            >
              CREATE SECURE ROOM
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
