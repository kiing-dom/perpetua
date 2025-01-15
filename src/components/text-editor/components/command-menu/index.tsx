import { useState } from "react";

import { CommandProps, CommandMenuProps } from "./types";
import { AlignLeft, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus, Terminal, Search } from "lucide-react";




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

export default CommandMenu;
