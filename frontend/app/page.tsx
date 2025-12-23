import { Header, Hero, Features, TrustedBy, Footer } from "@/landing-page";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <TrustedBy />
      <Features />
      <Footer />
    </main>
  );
}
