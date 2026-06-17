import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Aurora from "@/components/Aurora";
import Reveal from "@/components/Reveal";

export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-12 sm:pt-44">
      <Aurora />
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="eyebrow justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" />
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {sub && (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-mist-dim">{sub}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
