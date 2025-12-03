<<<<<<< HEAD
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import FormatToolbar from './FormatToolbar';

const Editor = ({ content, onChange, onEditorReady }: { content: string, onChange: (html: string) => void, onEditorReady?: (editor: any) => void }) => {
    const editor = useEditor({
        onCreate: ({ editor }) => {
            if (onEditorReady) onEditorReady(editor);
        },
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing...',
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            FontFamily.configure({
                types: ['textStyle'],
            }),
            TextStyle,
            Underline,
            Highlight.configure({
                multicolor: true,
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 text-gray-900 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900',
            },
        },
    });

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-white shadow-sm rounded-lg border border-gray-200">
            <FormatToolbar editor={editor} />
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} className="min-h-[500px] text-gray-900" />
            </div>
        </div>
    );
};

export default Editor;
=======
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import FormatToolbar from './FormatToolbar';

const Editor = ({ content, onChange, onEditorReady }: { content: string, onChange: (html: string) => void, onEditorReady?: (editor: any) => void }) => {
    const editor = useEditor({
        onCreate: ({ editor }) => {
            if (onEditorReady) onEditorReady(editor);
        },
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start writing...',
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            FontFamily.configure({
                types: ['textStyle'],
            }),
            TextStyle,
            Underline,
            Highlight.configure({
                multicolor: true,
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 text-gray-900 prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900',
            },
        },
    });

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-white shadow-sm rounded-lg border border-gray-200">
            <FormatToolbar editor={editor} />
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor} className="min-h-[500px] text-gray-900" />
            </div>
        </div>
    );
};

export default Editor;
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
