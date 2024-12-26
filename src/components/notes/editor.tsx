import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b p-2 flex gap-2 bg-neutral-700">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded hover:bg-gray-500 ${editor.isActive('bold') ? 'bg-gray-400' : ''}`}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded hover:bg-gray-500 ${editor.isActive('italic') ? 'bg-gray-400' : ''}`}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-1 rounded hover:bg-gray-500 ${editor.isActive('bulletList') ? 'bg-gray-400' : ''}`}
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-1 rounded hover:bg-gray-500 ${editor.isActive('orderedList') ? 'bg-gray-400' : ''}`}
      >
        1. List
      </button>
    </div>
  );
};

interface TextEditorProps {
  defaultValue?: string;
  onChange?: (html: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  defaultValue = '<p>Start writing...</p>',
  onChange 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg overflow-hidden bg-neutral-500 bg-opacity-60">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
};

export default TextEditor;