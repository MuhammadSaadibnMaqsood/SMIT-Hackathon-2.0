/**
 * Marketing Layout — HelpHub AI
 * ==============================
 * Public pages with shared AppNavbar and Footer.
 */

import AppNavbar from "@/components/AppNavbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <AppNavbar />
      <div className="flex-1">
        {children}
      </div>
      {/* Footer */}
      <footer className="border-t border-border/50 py-6 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          HelpHub AI is built as a premium-feel, multi-page community support product using HTML, CSS, JavaScript, and LocalStorage.
        </p>
      </footer>
    </div>
  );
}
