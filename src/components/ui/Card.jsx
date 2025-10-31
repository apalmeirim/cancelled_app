import cn from "../../utils/cn";

export default function Card({ as: Component = "div", className, children, padding = "md", ...props }) {
  const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <Component
      className={cn(
        "rounded-2xl border border-white/10 bg-slate-950/50 shadow-[0_18px_45px_rgba(15,23,42,0.45)] backdrop-saturate-150",
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
