import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OutputData } from "@editorjs/editorjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTextFromEditorJS(data: OutputData | undefined): string {
  if (!data || !data.blocks) return "";
  
  let text = "";
  data.blocks.forEach((block) => {
    if (block.data?.text) {
      text += block.data.text.replace(/<[^>]+>/g, "") + " ";
    } else if (block.data?.items) {
      block.data.items.forEach((item: string) => {
        text += item.replace(/<[^>]+>/g, "") + " ";
      });
    }
  });
  return text.trim();
}
