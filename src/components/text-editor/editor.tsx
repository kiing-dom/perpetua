import React, { useState, useEffect } from 'react';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import { Position } from './components/command-menu/types';
import VoiceRecorder from './components/voice-recorder/index';
import CommandMenu from './components/command-menu';

import {
  Bold, Italic, Code, Heading1, Heading2, 
  ChevronDown, Plus, 
  Heading3, Terminal} from 'lucide-react';

import { getEditorClassNames } from './styles/editor-styles';
import './styles/editor.css';
import './styles/syntax-highlight.css';

interface TextEditorProps {
  defaultValue?: string;
  onChange?: (html: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  defaultValue = '',
  onChange
}) => {
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState<boolean>(false);
  const [commandMenuPosition, setCommandMenuPosition] = useState<Position>({ x: 0, y: 0 });

  const editor = useEditor({
    
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