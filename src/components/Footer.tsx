/**
 * Global Footer Component
 * ======================
 * Simple, premium footer with social links and copyright info.
 */

export default function Footer() {
  return (
    <footer className="relative z-50 py-12 px-8 md:px-16 border-t border-border bg-background/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Side: Brand & Copyright */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <p className="text-[10px] text-muted-foreground font-bold tracking-[0.3em] uppercase">
            Helplytics AI
          </p>
          <p className="text-xs text-muted-foreground/80">
            © {new Date().getFullYear()} Helplytics AI. All rights reserved.
          </p>
        </div>

        {/* Right Side: Social Links */}
        <div className="flex gap-10 text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
          <button className="hover:text-violet-400 transition-colors cursor-pointer">
            Twitter
          </button>
          <button className="hover:text-violet-400 transition-colors cursor-pointer">
            Discord
          </button>
          <button className="hover:text-violet-400 transition-colors cursor-pointer">
            Github
          </button>
        </div>
      </div>

      {/* Subtle Bottom Glow to ground the footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-violet-600/5 blur-[120px] pointer-events-none" />
    </footer>
  );
}
