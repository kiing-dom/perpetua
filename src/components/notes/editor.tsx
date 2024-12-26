import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Minus
} from 'lucide-react';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const MenuButton = ({ 
    onClick, 
    isActive = false,
    children,
    tooltip
  }: { 
    onClick: () => void,
    isActive?: boolean,
    children: React.ReactNode,
    tooltip: string
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-neutral-600 transition-colors duration-200
        ${isActive ? 'bg-neutral-600 text-white' : 'text-neutral-200'}`}
      title={tooltip}
    >
      {children}
    </button>
  );

  return (
    <div className="border-b border-neutral-600 p-1 flex flex-wrap gap-1 bg-neutral-700 sticky top-0">
      <div className="flex items-center gap-1 px-1">
        <select
          onChange={e => {
            const level = parseInt(e.target.value);
            level === 0 
              ? editor.chain().focus().setParagraph().run()
              : editor.chain().focus().toggleHeading({ level }).run();
          }}
          value={
            editor.isActive('heading', { level: 1 }) 
              ? '1' 
              : editor.isActive('heading', { level: 2 }) 
                ? '2' 
                : editor.isActive('heading', { level: 3 }) 
                  ? '3' 
                  : '0'
          }
          className="bg-neutral-700 text-neutral-200 border border-neutral-600 rounded px-2 py-1 focus:outline-none hover:bg-neutral-600"
        >
          <option value="0">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
        </select>
      </div>

      <div className="w-px h-6 bg-neutral-600 my-auto mx-1" />

      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        tooltip="Bold"
      >
        <Bold size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        tooltip="Italic"
      >
        <Italic size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        tooltip="Inline Code"
      >
        <Code size={16} />
      </MenuButton>

      <div className="w-px h-6 bg-neutral-600 my-auto mx-1" />

      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        tooltip="Bullet List"
      >
        <List size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        tooltip="Numbered List"
      >
        <ListOrdered size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        tooltip="Quote"
      >
        <Quote size={16} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        tooltip="Horizontal Rule"
      >
        <Minus size={16} />
      </MenuButton>
    </div>
  );
};

interface TextEditorProps {
  defaultValue?: string;
  onChange?: (html: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  defaultValue = '<p>Type "/" for commands...</p>',
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
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none'
      },
    },
  });

  return (
    <div className="border border-neutral-600 rounded-lg overflow-hidden bg-neutral-800 text-neutral-200">
      <MenuBar editor={editor} />
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEditor;