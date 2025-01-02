import { Paragraph } from '@tiptap/extension-paragraph';

const CustomParagraph = Paragraph.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: 'custom-paragraph',
        }
      }
    }
  });

  export default CustomParagraph;