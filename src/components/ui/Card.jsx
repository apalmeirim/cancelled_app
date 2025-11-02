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
        "rounded-2xl border border-white/12 bg-black/75 shadow-[0_18px_45px_rgba(0,0,0,0.55)] backdrop-saturate-150",
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
