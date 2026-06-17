import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Aurora from "@/components/Aurora";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center px-6 text-center">
      <Aurora />
      <div>
        <Logo className="mx-auto" href="/" />
        <div className="mt-8 text-7xl font-semibold gradient-text-flow">404</div>
        <h1 className="mt-4 text-2xl font-semibold text-mist">This page took a wrong turn.</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-mist-dim">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" className="btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </main>
  );
}
