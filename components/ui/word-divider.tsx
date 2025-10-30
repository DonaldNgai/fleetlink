import React from 'react';

interface WordDividerProps {
  word?: string;
}

export const WordDivider: React.FC<WordDividerProps> = ({ word = 'or' }) => {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-border" />
      <span className="text-muted-foreground">{word}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
};
