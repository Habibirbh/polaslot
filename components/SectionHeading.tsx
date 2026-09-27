export default function SectionHeading({
  eyebrow,
  title,
  accent,
  after,
  body,
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: string;
  accent: string;
  after?: string;
  body?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <Tag className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
        {title} <span className="serif-accent">{accent}</span>
        {after ? ` ${after}` : ""}
      </Tag>
      {body && <p className="mt-4 text-[17px] leading-relaxed text-zinc-600">{body}</p>}
    </div>
  );
}
