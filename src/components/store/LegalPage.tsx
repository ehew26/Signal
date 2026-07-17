export default function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: { h: string; p: string }[];
}) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-mist sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-[13px] text-mist-faint">Last updated {new Date().getFullYear()}</p>
      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-lg font-semibold text-mist">{s.h}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-mist-dim">{s.p}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
