import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { languages } from '../config/languages';

const lowlight = createLowlight(common);

languages.forEach(([name, language]) => lowlight.register(name, language));


export const CustomCodeBlock = CodeBlockLowlight.extend({
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