import cn from "../../utils/cn";

const variantClasses = {
  primary:
    "bg-white text-black border border-white/80 shadow-[0_12px_30px_rgba(255,255,255,0.15)] hover:bg-gray-200 focus-visible:outline-white",
  secondary:
    "bg-black text-white border border-white/60 hover:bg-gray-900 focus-visible:outline-white",
  outline:
    "border border-white/60 text-white hover:bg-white/10 focus-visible:outline-white",
  ghost:
    "text-white hover:bg-white/10 focus-visible:outline-white",
  subtle:
    "bg-gray-900 text-gray-100 border border-white/10 hover:bg-gray-800 focus-visible:outline-white",
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
