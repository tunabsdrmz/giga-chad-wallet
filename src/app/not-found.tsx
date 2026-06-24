import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center p-6">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-160 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="relative max-w-md text-center">
          <p className="font-mono text-7xl font-bold tracking-tighter text-primary">
            404
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            Lost in the meta
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            We couldn&rsquo;t find the page you&rsquo;re looking for. The mint
            might be wrong, or the page may have moved.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button nativeButton={false} render={<Link href="/" />} className="gap-2">
              <Home size={14} />
              Home
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/trade" />}
              className="gap-2"
            >
              <Compass size={14} />
              Explore tokens
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
