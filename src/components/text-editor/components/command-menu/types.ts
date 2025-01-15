import { Editor } from "@tiptap/react";

export interface CommandProps {
  title: string;
  icon: React.ReactNode;
  action: () => void;
  isActive?: boolean;
}

export interface CommandMenuProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface Position {
  x: number;
  y: number;
}