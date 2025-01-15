import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import CustomParagraph from './CustomParagraph';
import { CustomCodeBlock } from './CustomCodeBlock';
import VoiceNote from './VoiceNote';

const extensions = [
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
      CustomCodeBlock,
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
    ];