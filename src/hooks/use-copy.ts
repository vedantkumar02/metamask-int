import React, { useState } from "react";
import toast from "react-hot-toast";
import { parseError } from "@/utils";

export const useCopy = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, copyString: string) => {
    event.stopPropagation();
    if (!copyString) return;
    if (copied) return;

    try {
      await navigator.clipboard.writeText(copyString);

      setCopied(true);
      const timeoutId = setTimeout(() => {
        setCopied(false);
        clearTimeout(timeoutId);
      }, 2000);
    } catch (error: unknown) {
      console.error("Error copying text to clipboard: ", error);
      const message = parseError(error);
      toast.error(message);
    }
  };

  return { copied, copyToClipboard } as const;
};
