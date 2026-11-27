import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ThemeCustomizerWrapper } from "@/components/blocks/theme-customizer-wrapper";

export function PublicPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="relative flex flex-1 flex-col">{children}</main>
      <Footer />
      <ThemeCustomizerWrapper />
    </div>
  );
}
