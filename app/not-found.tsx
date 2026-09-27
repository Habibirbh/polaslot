import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-[-0.035em]">
        Flag on the <span className="serif-accent">play.</span>
      </h1>
      <p className="mt-4 text-zinc-600">That page went out of bounds.</p>
      <Link href="/" className="btn-primary mt-8">Back to PolaSlot</Link>
    </section>
  );
}
