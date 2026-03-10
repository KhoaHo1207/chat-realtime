import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-[0.4em] text-zinc-500">404 · Not Found</span>
          <h1 className="text-5xl font-black text-white sm:text-6xl">Room disappeared</h1>
          <p className="max-w-xl text-base text-zinc-400">
            The room you tried to visit either expired, was destroyed, or never existed. Create a new secure chat
            room or return to the homepage to continue chatting.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rounded-md border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm font-bold uppercase tracking-wider text-green-400 transition hover:border-green-500 hover:text-green-200">
            Create new room
          </Link>
          <Link
            href="/"
            className="rounded-md border border-zinc-800 px-6 py-3 text-sm font-bold uppercase tracking-wider text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
