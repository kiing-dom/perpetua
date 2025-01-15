export const editorStyles = {
    editor: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4',
    heading: {
      h1: 'prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h1:leading-tight', // Added leading-tight
      h2: 'prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:leading-snug', // Added leading-snug
      h3: 'prose-h3:text-xl prose-h3:font-medium prose-h3:mb-2 prose-h3:leading-normal' // Added leading-normal
    },
    text: {
      paragraph: 'prose-p:text-base prose-p:mt-2',
      blockquote: 'prose-blockquote:border-l-2 prose-blockquote:border-neutral-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:leading-loose',
      code: 'prose-code:text-sm prose-code:bg-neutral-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
      preformatted: 'prose-pre:bg-neutral-900 prose-pre:p-4 prose-pre:rounded-lg'
    },
    lists: {
      unordered: 'prose-ul:list-disc prose-ul:ml-4 prose-ul:leading-relaxed',
      ordered: 'prose-ol:list-decimal prose-ol:ml-4 prose-ol:leading-relaxed',
      item: 'prose-li:mb-1 prose-li:leading-snug'
    },
    misc: {
      horizontalRule: 'prose-hr:border-neutral-600'
    }
  };
  
  export const getEditorClassNames = () => {
    return [
      editorStyles.editor,
      editorStyles.heading.h1,
      editorStyles.heading.h2,
      editorStyles.heading.h3,
      editorStyles.text.paragraph,
      editorStyles.text.blockquote,
      editorStyles.text.code,
      editorStyles.text.preformatted,
      editorStyles.lists.unordered,
      editorStyles.lists.ordered,
      editorStyles.lists.item,
      editorStyles.misc.horizontalRule
    ].join(' ');
  };