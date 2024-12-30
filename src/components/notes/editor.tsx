import React, { useState, useEffect } from 'react';
import { Editor, useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import { 
  Bold, Italic, Code, Heading1, Heading2, List, 
  ListOrdered, Quote, Minus, ChevronDown, Plus, Search,
  Heading3, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

interface CommandProps {
  title: string;
  icon: React.ReactNode;
  action: () => void;
  isActive?: boolean;
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
    { 
      title: 'Text', 
      icon: <AlignLeft size={16} />, 
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph')
    },
    { 
      title: 'Heading 1', 
      icon: <Heading1 size={16} />, 
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 })
    },
    { 
      title: 'Heading 2', 
      icon: <Heading2 size={16} />, 
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 })
    },
    { 
      title: 'Heading 3', 
      icon: <Heading3 size={16} />, 
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 })
    },
    { 
      title: 'Bullet List', 
      icon: <List size={16} />, 
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList')
    },
    { 
      title: 'Numbered List', 
      icon: <ListOrdered size={16} />, 
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList')
    },
    { 
      title: 'Quote', 
      icon: <Quote size={16} />, 
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote')
    },
    { 
      title: 'Divider', 
      icon: <Minus size={16} />, 
      action: () => editor.chain().focus().setHorizontalRule().run()
    },
  ];

  const filteredCommands = commands.filter(command => 
    command.title.toLowerCase().includes(query.toLowerCase())
  );

  return isOpen ? (
    <div className="absolute z-50 w-72 bg-neutral-800 rounded-lg shadow-lg border border-neutral-600 overflow-hidden">
      <div className="p-2 border-b border-neutral-600">
        <div className="flex items-center gap-2 px-2 text-neutral-400">
          <Search size={14} />
          <input
            type="text"
            placeholder="Type to filter..."
            className="w-full bg-transparent border-none outline-none text-sm text-neutral-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {filteredCommands.map((command, index) => (
          <button
            key={index}
            className={`w-full px-3 py-2 hover:bg-neutral-700 flex items-center gap-3 text-neutral-200 ${
              command.isActive ? 'bg-neutral-700' : ''
            }`}
            onClick={() => {
              command.action();
              setIsOpen(false);
              setQuery('');
            }}
          >
            <span className="w-6 h-6 flex items-center justify-center">{command.icon}</span>
            <span className="text-sm flex-1 text-left">{command.title}</span>
            {command.isActive && <span className="text-xs text-neutral-400">Active</span>}
          </button>
        ))}
      </div>
    </div>
  ) : null;
};

const TextEditor: React.FC<TextEditorProps> = ({ 
  defaultValue = '', 
  onChange 
}) => {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState<boolean>(false);
  const [commandMenuPosition, setCommandMenuPosition] = useState<Position>({ x: 0, y: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if(node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`
          }
          
          return "Type '/' for commands..."
        },
        includeChildren: true,
        emptyEditorClass: 'cursor-text before:content-[attr(data-placeholder)] before:text-mauve-11 before:opacity-50 before-pointer-events-none'
        
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true
      })
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h3:text-xl prose-h3:font-medium prose-h3:mb-2 prose-p:text-base prose-p:mb-2 prose-blockquote:border-l-2 prose-blockquote:border-neutral-500 prose-blockquote:pl-4 prose-blockquote:italic prose-pre:bg-neutral-900 prose-pre:p-4 prose-pre:rounded-lg prose-code:text-sm prose-code:bg-neutral-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4 prose-li:mb-1 prose-hr:border-neutral-600',
        
      },
      handleKeyDown: (view, event) => {
        if (event.key === '/') {
          const { top, left } = view.coordsAtPos(view.state.selection.from);
          setCommandMenuPosition({ x: left, y: top + 20 });
          setIsCommandMenuOpen(true);
          return false;
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

  const formatButtonClass = (isActive: boolean) => 
    `p-2 rounded hover:bg-neutral-700 ${isActive ? 'bg-neutral-700' : ''}`;

  return (
    <div className="relative border border-neutral-600 rounded-lg bg-neutral-800 text-neutral-200">
      <div 
        className="p-1.5 border-b border-neutral-600 flex items-center gap-1"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="flex items-center gap-1 px-2 py-1 text-sm text-neutral-400 hover:bg-neutral-700 rounded"
          onClick={() => setIsCommandMenuOpen(!isCommandMenuOpen)}
        >
          <Plus size={16} />
          <ChevronDown size={16} />
        </button>
        <div className="h-4 w-px bg-neutral-600 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={formatButtonClass(editor.isActive('heading', { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={formatButtonClass(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={formatButtonClass(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
      </div>

      <BubbleMenu 
        editor={editor} 
        tippyOptions={{ duration: 100 }}
        className="flex items-center gap-1 p-1 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={formatButtonClass(editor.isActive('bold'))}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={formatButtonClass(editor.isActive('italic'))}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={formatButtonClass(editor.isActive('code'))}
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