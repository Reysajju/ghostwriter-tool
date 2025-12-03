<<<<<<< HEAD
'use client';

import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Type, Heading1, Heading2, Heading3
} from 'lucide-react';

interface FormatToolbarProps {
    editor: Editor | null;
}

export default function FormatToolbar({ editor }: FormatToolbarProps) {
    if (!editor) return null;

    const fontSizes = [
        { label: 'Small', value: '14px' },
        { label: 'Normal', value: '16px' },
        { label: 'Large', value: '20px' },
        { label: 'X-Large', value: '24px' }
    ];

    const fontFamilies = [
        { label: 'Sans', value: 'Inter, system-ui, sans-serif' },
        { label: 'Serif', value: 'Georgia, serif' },
        { label: 'Mono', value: 'Monaco, monospace' }
    ];

    const ToolbarButton = ({
        onClick,
        isActive,
        icon: Icon,
        label
    }: {
        onClick: () => void;
        isActive?: boolean;
        icon: any;
        label: string;
    }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded transition-colors ${isActive
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
            title={label}
        >
            <Icon size={16} />
        </button>
    );

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex flex-wrap items-center gap-2 shadow-sm">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    label="Bold (Ctrl+B)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    label="Italic (Ctrl+I)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    icon={Underline}
                    label="Underline (Ctrl+U)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    icon={Strikethrough}
                    label="Strikethrough"
                />
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    label="Heading 1"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    label="Heading 2"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    icon={Heading3}
                    label="Heading 3"
                />
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    icon={AlignLeft}
                    label="Align Left"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    icon={AlignCenter}
                    label="Align Center"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    icon={AlignRight}
                    label="Align Right"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    icon={AlignJustify}
                    label="Justify"
                />
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <Type size={16} className="text-gray-500" />
                <select
                    onChange={(e) => {
                        editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run();
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    {fontSizes.map((size) => (
                        <option key={size.value} value={size.value}>
                            {size.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Font Family */}
            <div className="flex items-center gap-1">
                <select
                    onChange={(e) => {
                        editor.chain().focus().setFontFamily(e.target.value).run();
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    {fontFamilies.map((font) => (
                        <option key={font.value} value={font.value}>
                            {font.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
=======
'use client';

import { Editor } from '@tiptap/react';
import {
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Type, Heading1, Heading2, Heading3
} from 'lucide-react';

interface FormatToolbarProps {
    editor: Editor | null;
}

export default function FormatToolbar({ editor }: FormatToolbarProps) {
    if (!editor) return null;

    const fontSizes = [
        { label: 'Small', value: '14px' },
        { label: 'Normal', value: '16px' },
        { label: 'Large', value: '20px' },
        { label: 'X-Large', value: '24px' }
    ];

    const fontFamilies = [
        { label: 'Sans', value: 'Inter, system-ui, sans-serif' },
        { label: 'Serif', value: 'Georgia, serif' },
        { label: 'Mono', value: 'Monaco, monospace' }
    ];

    const ToolbarButton = ({
        onClick,
        isActive,
        icon: Icon,
        label
    }: {
        onClick: () => void;
        isActive?: boolean;
        icon: any;
        label: string;
    }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded transition-colors ${isActive
                    ? 'bg-purple-600 text-white'
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
            title={label}
        >
            <Icon size={16} />
        </button>
    );

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex flex-wrap items-center gap-2 shadow-sm">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    label="Bold (Ctrl+B)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    label="Italic (Ctrl+I)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    icon={Underline}
                    label="Underline (Ctrl+U)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    icon={Strikethrough}
                    label="Strikethrough"
                />
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    label="Heading 1"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    label="Heading 2"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    icon={Heading3}
                    label="Heading 3"
                />
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    icon={AlignLeft}
                    label="Align Left"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    icon={AlignCenter}
                    label="Align Center"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    icon={AlignRight}
                    label="Align Right"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    icon={AlignJustify}
                    label="Justify"
                />
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                <Type size={16} className="text-gray-500" />
                <select
                    onChange={(e) => {
                        editor.chain().focus().setMark('textStyle', { fontSize: e.target.value }).run();
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    {fontSizes.map((size) => (
                        <option key={size.value} value={size.value}>
                            {size.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Font Family */}
            <div className="flex items-center gap-1">
                <select
                    onChange={(e) => {
                        editor.chain().focus().setFontFamily(e.target.value).run();
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    {fontFamilies.map((font) => (
                        <option key={font.value} value={font.value}>
                            {font.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
