import { useEffect } from "react";
import { createPortal } from "react-dom";
import cn from "../../utils/cn";
import Button from "./Button";

const modalRootId = "modal-root";

function ensureModalRoot() {
  let node = document.getElementById(modalRootId);
  if (!node) {
    node = document.createElement("div");
    node.id = modalRootId;
    document.body.appendChild(node);
  }
  return node;
}

export default function Modal({ title, description, isOpen, onClose, children, className }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const root = ensureModalRoot();
    root.dataset.open = "true";

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      delete root.dataset.open;
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-10 sm:px-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-[70] w-full max-w-3xl rounded-3xl border border-white/10 bg-black/90 shadow-[0_22px_60px_rgba(0,0,0,0.65)]",
          "p-6 sm:p-8",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {title ? <h2 className="text-2xl font-semibold text-white">{title}</h2> : null}
            {description ? <p className="text-sm text-gray-300">{description}</p> : null}
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Close tutorial"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em]"
          >
            Close
          </Button>
        </div>
        <div className="mt-6 space-y-6">{children}</div>
      </div>
    </div>,
    ensureModalRoot()
  );
}
