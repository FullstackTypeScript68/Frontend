import { useEffect, useState } from "react";

export function useImageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("Todo Image");

  const open = (imageSrc: string, imageAlt = "Todo Image") => {
    if (!imageSrc) return;
    setSrc(imageSrc);
    setAlt(imageAlt);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSrc("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return { isOpen, src, alt, open, close };
}
