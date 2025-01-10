import React, { useState, useEffect, useRef } from 'react';

import { Editor, useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state'

import { common, createLowlight, LanguageFn } from 'lowlight';

import {
  Bold, Italic, Code, Heading1, Heading2, List,
  ListOrdered, Quote, Minus, ChevronDown, Plus, Search,
  Heading3, AlignLeft, Terminal,
  Mic, Square, Play, Pause
} from 'lucide-react';


import { getEditorClassNames } from './styles/editor-styles';
import './styles/editor.css';
import CustomParagraph from './styles/CustomParagraph';
import './styles/syntax-highlight.css';

import js from 'highlight.js/lib/languages/javascript';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';

const lowlight = createLowlight(common);

const languages: [string, LanguageFn][] = [
  ['js', js],
  ['java', java],
  ['python', python],
  ['cpp', cpp],
  ['c', c],
  ['csharp', csharp],
  ['php', php],
];

languages.forEach(([name, language]) => lowlight.register(name, language));

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
    {
      title: 'Code Block',
      icon: <Terminal size={16} />,
      action: () => editor.chain().focus().setCodeBlock({ language: 'plain'}).run(),
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

interface TextEditorProps {
  defaultValue?: string;
  onChange?: (html: string) => void;
}

const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement('div');
      container.classList.add('relative', 'group');

      const select = document.createElement('select');
      select.classList.add(
        'absolute', 'right-2', 'top-2', 'bg-neutral-700',
        'text-white', 'text-sm', 'rounded', 'px-2', 'py-2',
        'border', 'border-neutral-600',
        'opacity-0', 'group-hover:opacity-100',
        'transition-opacity'
      );

      const languages = [
        { label: 'Plain Text', language: 'text' },
        { label: 'JavaScript', language: 'js' },
        { label: 'Java', language: 'java' },
        { label: 'Python', language: 'python' },
        { label: 'C', language: 'c' },
        { label: 'C#', language: 'csharp' },
        { label: 'C++', language: 'cpp' },
        { label: 'PHP', language: 'php' },
      ];

      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.language;
        option.textContent = lang.label;
        if (node.attrs.language === lang.language) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      select.addEventListener('change', (e) => {
        if(typeof getPos === 'function') {
          const target = e.target as HTMLSelectElement;
          editor.chain().focus().setCodeBlock({ language: target.value }).run();
        }
      });

      const pre = document.createElement('pre');
      pre.classList.add('rounded', 'bg-neutral-800', 'p-4', 'font-mono', 'text-sm');

      const code = document.createElement('code');
      code.textContent = node.textContent;

      pre.appendChild(code);
      container.appendChild(select);
      container.appendChild(pre);

      return {
        dom: container,
        contentDOM: code,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false;
          code.textContent = updatedNode.textContent;
          return true;
        }
      }
    }
  }
});

// Voice Note Extension
const VoiceNote = Extension.create({
  name: 'voiceNote',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'voice-note-container',
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          audioUrl: {
            default: null,
          },
          duration: {
            default: 0,
          },
        },
      },
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.innerHTML = `
        <div class="flex items-center gap-2 p-2 bg-neutral-700 rounded">
          <button class="play-button">
            <Play size={16} />
          </button>
          <div class="flex-1">
            <div class="h-1 bg-neutral-600 rounded">
              <div class="h-full bg-blue-500 rounded" style="width: 0%"></div>
            </div>
          </div>
          <span class="text-xs text-neutral-400">${formatDuration(node.attrs.duration)}</span>
        </div>
      `;

      return { dom }
    }
  }
});

// Voice Recorder Component
interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav'});
        onRecordingComplete(audioBlob, duration);
        setDuration(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setDuration(seconds);
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  return (
    <button
      className={`p-2 rounded ${isRecording ? 'bg-red-500' : 'bg-neutral-700'}`}
      onClick={isRecording ? stopRecording : startRecording}
      title={isRecording ? 'Stop Recording' : 'Start Recording'}
    >
      {isRecording ? <Square size={16} /> : <Mic size={16} /> }
    </button>
  );
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        code: {
          HTMLAttributes: {
            class: 'rounded px-1.5 py-0.5 font-mono text-sm',
          },
        },
      }),
      CustomCodeBlock.configure({
        lowlight,
        HTMLAttributes: {
          class: 'rounded bg-neutral p-4 font-mono text-sm'
        }
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
      }),
      VoiceNote
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

        if (event.key === 'Tab' && view.state.selection.$from.parent.type.name === 'codeBlock') {
          event.preventDefault();
          view.dispatch(view.state.tr.insertText('  '));
          return true;
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

  const handleRecordingComplete = (audioBlob: Blob, duration : number) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    editor?.chain().focus().insertContent({
      type: 'voiceNote',
      attrs: { audioUrl, duration }
    }).run();
  }

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
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={formatButtonClass(editor.isActive('code'))}
          title='Inline Code'
        >
          <Code size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setCodeBlock().run()}
          className={formatButtonClass(editor.isActive('codeBlock'))}
          title='Code Block'
        >
          <Terminal size={16} />
        </button>

        <div className='h-4 w-px bg-neutral-600 mx-1' />
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
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