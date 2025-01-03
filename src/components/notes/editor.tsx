import React, { useState, useEffect } from 'react';

import { Editor, useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import { common, createLowlight } from 'lowlight';

import {
  Bold, Italic, Code, Heading1, Heading2, List,
  ListOrdered, Quote, Minus, ChevronDown, Plus, Search,
  Heading3, AlignLeft
} from 'lucide-react';


import { getEditorClassNames } from './styles/editor-styles';
import './styles/editor.css';
import CustomParagraph from './styles/CustomParagraph';
import './styles/syntax-highlight.css';

import js from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';

const lowlight = createLowlight(common);

lowlight.register('js', js);
lowlight.register('java', java);

interface LanguageSelectProps {
  editor: Editor;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ editor }) => {
  const languages = [
    { label: 'Plain Text', value: 'text' },
    { label: 'JavaScript', value: 'js'},
    { label: 'Java', value: 'java'},
  ];

  const currentLanguage = editor.getAttributes('codeBlock').language || 'text';

  return (
    <select
      className=''
      value={currentLanguage}
      onChange={(e) => {
        editor
          .chain()
          .focus()
          .setCodeBlock({ language: e.target.value })
          .run();
      }}
    >
      {languages.map((lang) => (
        <option
          key={lang.value} value={lang.value}
        >
          {lang.label}
        </option>
      ))}
    </select>
  )
}

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
            onKeyDown={(e) => {
              if (e.key === '/') {
                e.preventDefault();
              }
            }}
            autoFocus
          />
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {filteredCommands.map((command, index) => (
          <button
            key={index}
            className={`w-full px-3 py-2 hover:bg-neutral-700 flex items-center gap-3 text-neutral-200 ${command.isActive ? 'bg-neutral-700' : ''
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
        },
        paragraph: false,
      }),
      CustomParagraph,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
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
      const markdown = editor.storage.markdown.getMarkdown();
      onChange?.(markdown);
    },
    editorProps: {
      attributes: {
        class: getEditorClassNames(),
      },
      handleKeyDown: (view, event) => {
        if (event.key == '/') {

          event.preventDefault();

          try {
            const selection = view.state.selection;
            const coords = view.coordsAtPos(selection.from);

            if (!coords) {
              console.error("Could not determine coordinates for the selection");
              return true;
            }

            setCommandMenuPosition({ x: coords.left, y: coords.top });
            setIsCommandMenuOpen(true);
            return true;
          } catch (error) {
            console.error('Error handling keydown event:', error);
            return true;
          }
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