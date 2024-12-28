import React, { useState, useEffect } from 'react';
import { Editor, useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, Italic, Code, Heading1, Heading2, List, 
  ListOrdered, Quote, Minus, Image, Check, Link,
  ChevronDown, Plus, Search
} from 'lucide-react';

interface CommandProps {
  title: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandMenuProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface Position {
  x: number;
  y: number;
}

interface TextEditorProps {
  defaultValue?: string;
  onChange?: (html: string) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ editor, isOpen, setIsOpen }) => {
  const [query, setQuery] = useState<string>('');
  
  const commands: CommandProps[] = [
    { title: 'Text', icon: <Bold size={16} />, action: () => editor.chain().focus().setParagraph().run() },
    { title: 'Heading 1', icon: <Heading1 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { title: 'Heading 2', icon: <Heading2 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { title: 'Bullet List', icon: <List size={16} />, action: () => editor.chain().focus().toggleBulletList().run() },
    { title: 'Numbered List', icon: <ListOrdered size={16} />, action: () => editor.chain().focus().toggleOrderedList().run() },
    { title: 'Quote', icon: <Quote size={16} />, action: () => editor.chain().focus().toggleBlockquote().run() },
    { title: 'Divider', icon: <Minus size={16} />, action: () => editor.chain().focus().setHorizontalRule().run() },
  ];

  const filteredCommands = commands.filter(command => 
    command.title.toLowerCase().includes(query.toLowerCase())
  );

  return isOpen ? (
    <div className="absolute z-50 w-64 bg-neutral-800 rounded-lg shadow-lg border border-neutral-600 overflow-hidden">
      <div className="p-2 border-b border-neutral-600">
        <div className="flex items-center gap-2 px-2 text-neutral-400">
          <Search size={14} />
          <input
            type="text"
            placeholder="Type to filter..."
            className="w-full bg-transparent border-none outline-none text-sm text-neutral-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {filteredCommands.map((command, index) => (
          <button
            key={index}
            className="w-full px-2 py-1.5 hover:bg-neutral-700 flex items-center gap-2 text-neutral-200"
            onClick={() => {
              command.action();
              setIsOpen(false);
              setQuery('');
            }}
          >
            <span className="w-6 h-6 flex items-center justify-center">{command.icon}</span>
            <span className="text-sm">{command.title}</span>
          </button>
        ))}
      </div>
    </div>
  ) : null;
};

const TextEditor: React.FC<TextEditorProps> = ({ 
  defaultValue = '<p>Type "/" for commands...</p>', 
  onChange 
}) => {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState<boolean>(false);
  const [commandMenuPosition, setCommandMenuPosition] = useState<Position>({ x: 0, y: 0 });

  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4'
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          const { top, left } = view.coordsAtPos(view.state.selection.from);
          setCommandMenuPosition({ x: left, y: top + 20 });
          setIsCommandMenuOpen(true);
        }
        return false;
      },
    },
  });

  useEffect(() => {
    const handleClick = () => setIsCommandMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!editor) return null;

  return (
    <div className="relative border border-neutral-600 rounded-lg bg-neutral-800 text-neutral-200">
      <div 
        className="p-1.5 border-b border-neutral-600 flex items-center gap-2"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="flex items-center gap-1 px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-700 rounded"
          onClick={() => setIsCommandMenuOpen(!isCommandMenuOpen)}
        >
          <Plus size={16} />
          <ChevronDown size={16} />
        </button>
      </div>

      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ duration: 100 }}
        className="flex items-center gap-1 p-1 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-neutral-700 ${editor.isActive('bold') ? 'bg-neutral-700' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-neutral-700 ${editor.isActive('italic') ? 'bg-neutral-700' : ''}`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1 rounded hover:bg-neutral-700 ${editor.isActive('code') ? 'bg-neutral-700' : ''}`}
        >
          <Code size={16} />
        </button>
      </BubbleMenu>

      <div style={{ position: 'relative' }}>
        <EditorContent editor={editor} />
        <div
          style={{
            position: 'absolute',
            top: commandMenuPosition.y,
            left: commandMenuPosition.x,
          }}
        >
          <CommandMenu 
            editor={editor} 
            isOpen={isCommandMenuOpen} 
            setIsOpen={setIsCommandMenuOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default TextEditor;