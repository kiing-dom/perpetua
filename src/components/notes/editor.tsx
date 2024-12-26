import React, { useEffect, useRef } from 'react';

import { EditorInstance } from 'novel';

import './editor.css';

const TextEditor = () => {
    const editorContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (editorContainerRef.current) {
            const editor = new EditorInstance({
                element: editorContainerRef.current,
                content: "<p>Start writing...</p>",
                onUpdate: ({ editor }) => {
                    console.log("Updated content:", editor);
                },
            });

            return () => {
                editor.destroy(); // Clean up editor instance on component unmount
            };
        }
    }, []);
    return (
        <div className='text-editor'>
            <div ref={editorContainerRef} />
        </div>
    );
};

export default TextEditor;