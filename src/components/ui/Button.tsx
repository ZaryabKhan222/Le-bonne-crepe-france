import Link from "next/link";

type Variant = "gold" | "outline" | "ghost-light";

const styles: Record<Variant, string> = {
  gold: "bg-gold text-charcoal hover:bg-gold-light active:bg-gold-deep active:text-cream shadow-[0_1px_12px_rgba(201,163,78,0.35)]",
  outline:
    "border border-gold-deep/50 text-gold-deep hover:border-gold-deep hover:bg-gold-deep/5 active:bg-gold-deep/10",
  "ghost-light":
    "border border-cream/30 text-cream hover:border-gold-light hover:text-gold-light active:bg-cream/10",
};

export default function Button({
  href,
  variant = "gold",
  children,
  className = "",
  ...rest
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-wide uppercase transition-colors duration-300 ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
