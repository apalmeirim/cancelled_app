import cn from "../../utils/cn";

const variantClasses = {
  primary:
    "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 text-slate-950 shadow-[0_15px_35px_rgba(16,185,129,0.35)] hover:from-emerald-300 hover:via-emerald-400 hover:to-teal-300 focus-visible:outline-emerald-200",
  secondary:
    "bg-white/10 text-emerald-100 border border-emerald-200/40 hover:bg-white/15 focus-visible:outline-emerald-200",
  outline:
    "border border-emerald-400/60 text-emerald-200 hover:bg-emerald-400/10 focus-visible:outline-emerald-200",
  ghost:
    "text-emerald-200 hover:bg-white/10 focus-visible:outline-emerald-200",
  subtle:
    "bg-slate-900/60 text-slate-100 border border-white/5 hover:bg-slate-900/75 focus-visible:outline-slate-200",
};

const sizeClasses = {
  sm: "text-sm px-3 py-2 rounded-lg",
  md: "text-base px-4 py-2.5 rounded-xl",
  lg: "text-lg px-6 py-3 rounded-2xl",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  leading,
  trailing,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {leading ? <span className="flex h-5 w-5 items-center justify-center">{leading}</span> : null}
      <span className="whitespace-nowrap">{children}</span>
      {trailing ? <span className="flex h-5 w-5 items-center justify-center">{trailing}</span> : null}
    </Component>
  );
}
