import React, { useMemo } from 'react';
import * as Diff from 'diff';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DiffHighlighterProps {
  original: string;
  modified: string;
  className?: string;
}

export function DiffHighlighter({ original, modified, className }: DiffHighlighterProps) {
  const diffResult = useMemo(() => {
    // If original is missing, just show modified normally
    if (!original) {
        return [{ value: modified, added: false, removed: false }];
    }
    // We only want to show the MODIFICATIONS on the target string, 
    // without showing the removals explicitly (or maybe we show them struck out?).
    // A clean approach is to use 'diffWords' and just render additions in green.
    // If there's an addition, it's new text.
    return Diff.diffWords(original, modified);
  }, [original, modified]);

  if (!modified) return null;

  return (
    <span className={cn("whitespace-pre-wrap leading-relaxed", className)}>
      {diffResult.map((part, index) => {
        // Only render added text or unchanged text. 
        // We skip removed text to just show the "final" string with highlights.
        if (part.removed) return null;

        return (
          <span
            key={index}
            className={cn(
              "transition-colors duration-300",
              part.added ? "bg-green-100 text-green-900 px-1 rounded-sm mx-[1px] font-medium" : "text-inherit"
            )}
          >
            {part.value}
          </span>
        );
      })}
    </span>
  );
}
