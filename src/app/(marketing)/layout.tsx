import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { getSession } from "@/lib/auth";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = Boolean(await getSession());
  return (
    <>
      <Header isAuthed={isAuthed} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
