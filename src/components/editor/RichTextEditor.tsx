import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Code,
    AlignLeft, AlignCenter, AlignRight,
    Highlighter, Link as LinkIcon, Undo, Redo, Minus,
} from 'lucide-react';
import React, { useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const MenuButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}> = ({ onClick, isActive, disabled, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-1.5 rounded transition-colors ${isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
        {children}
    </button>
);

const Divider = () => <div className="w-px h-5 bg-slate-200 mx-0.5" />;

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    content,
    onChange,
    placeholder = 'Bắt đầu viết ghi chú...',
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            Placeholder.configure({ placeholder }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: false }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-slate max-w-none focus:outline-none min-h-[120px] max-h-[300px] overflow-y-auto px-3 py-2',
            },
        },
    });

    // Sync content khi prop thay đổi từ bên ngoài (ví dụ khi mở Edit modal)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    if (!editor) return null;

    const handleAddLink = () => {
        const url = window.prompt('Nhập URL:', 'https://');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200">
                {/* Undo / Redo */}
                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Hoàn tác (Ctrl+Z)"
                >
                    <Undo size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Làm lại (Ctrl+Y)"
                >
                    <Redo size={15} />
                </MenuButton>

                <Divider />

                {/* Text formatting */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="In đậm (Ctrl+B)"
                >
                    <Bold size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="In nghiêng (Ctrl+I)"
                >
                    <Italic size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Gạch dưới (Ctrl+U)"
                >
                    <UnderlineIcon size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Gạch ngang"
                >
                    <Strikethrough size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    isActive={editor.isActive('highlight')}
                    title="Tô sáng"
                >
                    <Highlighter size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="Code inline"
                >
                    <Code size={15} />
                </MenuButton>

                <Divider />

                {/* Lists */}
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Danh sách"
                >
                    <List size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Danh sách số"
                >
                    <ListOrdered size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Trích dẫn"
                >
                    <Quote size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Đường kẻ ngang"
                >
                    <Minus size={15} />
                </MenuButton>

                <Divider />

                {/* Alignment */}
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Căn trái"
                >
                    <AlignLeft size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Căn giữa"
                >
                    <AlignCenter size={15} />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Căn phải"
                >
                    <AlignRight size={15} />
                </MenuButton>

                <Divider />

                {/* Link */}
                <MenuButton
                    onClick={handleAddLink}
                    isActive={editor.isActive('link')}
                    title="Chèn liên kết"
                >
                    <LinkIcon size={15} />
                </MenuButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
};
