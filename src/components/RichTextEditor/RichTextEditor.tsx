"use client";

import type React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeXmlIcon,
  UndoIcon,
  RedoIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  PilcrowIcon,
  LinkIcon,
  ImageIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react"; 

import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TiptapToolbar = ({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [, forceUpdate] = useState(0);
  const [showImageControls, setShowImageControls] = useState(false);
  const [selectedImageNode, setSelectedImageNode] = useState<any>(null);

  const checkImageSelection = useCallback(() => {
    if (!editor) return;

    const { selection } = editor.state;
    const { $from } = selection;

    let imageNode = null;

    $from.doc.descendants((node, pos) => {
      if (
        node.type.name === "image" &&
        pos <= $from.pos &&
        pos + node.nodeSize >= $from.pos
      ) {
        imageNode = node;
        return false;
      }
    });

    if (imageNode) {
      setSelectedImageNode(imageNode);
      setShowImageControls(true);
    } else {
      setSelectedImageNode(null);
      setShowImageControls(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      forceUpdate((prev) => prev + 1);
      checkImageSelection();
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("transaction", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("transaction", handleSelectionUpdate);
    };
  }, [editor, checkImageSelection]);

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          editor
            .chain()
            .focus()
            .setImage({ src: e.target.result as string })
            .run();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const setFontFamily = (fontFamily: string) => {
    editor.chain().focus().setFontFamily(fontFamily).run();
  };

  const resizeImage = (width: string) => {
    if (selectedImageNode) {
      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          width: width,
          style: `width: ${width}; height: auto;`,
        })
        .run();
    }
  };

  const handleAlignment = (alignment: string) => {
    const { selection } = editor.state;
    const { $from } = selection;

    let imageNode = null;
    let imagePos = null;

    $from.doc.descendants((node, pos) => {
      if (
        node.type.name === "image" &&
        pos <= $from.pos &&
        pos + node.nodeSize >= $from.pos
      ) {
        imageNode = node;
        imagePos = pos;
        return false;
      }
    });

    if (imageNode && imagePos !== null) {
      editor
        .chain()
        .focus()
        .updateAttributes("image", { textAlign: alignment })
        .run();
    } else {
      editor.chain().focus().setTextAlign(alignment).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Bold"
      >
        <BoldIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Italic"
      >
        <ItalicIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Strikethrough"
      >
        <StrikethroughIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        variant="ghost"
        size="icon"
        aria-label="Paragraph"
      >
        <PilcrowIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Heading 1"
      >
        <Heading1Icon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Heading 2"
      >
        <Heading2Icon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Heading 3"
      >
        <Heading3Icon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Bullet List"
      >
        <ListIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Ordered List"
      >
        <ListOrderedIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Blockquote"
      >
        <QuoteIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Code Block"
      >
        <CodeXmlIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={setLink}
        className={editor.isActive("link") ? "is-active" : ""}
        variant="ghost"
        size="icon"
        aria-label="Insert Link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <Button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        variant="ghost"
        size="icon"
        aria-label="Insert Image"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>

      {/* Alignment Buttons */}
      <Button
        type="button"
        onClick={() => handleAlignment("left")}
        className={
          editor.isActive({ textAlign: "left" }) ||
          editor.isActive("image", { textAlign: "left" })
            ? "is-active"
            : ""
        }
        variant="ghost"
        size="icon"
        aria-label="Align Left"
      >
        <AlignLeftIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => handleAlignment("center")}
        className={
          editor.isActive({ textAlign: "center" }) ||
          editor.isActive("image", { textAlign: "center" })
            ? "is-active"
            : ""
        }
        variant="ghost"
        size="icon"
        aria-label="Align Center"
      >
        <AlignCenterIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => handleAlignment("right")}
        className={
          editor.isActive({ textAlign: "right" }) ||
          editor.isActive("image", { textAlign: "right" })
            ? "is-active"
            : ""
        }
        variant="ghost"
        size="icon"
        aria-label="Align Right"
      >
        <AlignRightIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => handleAlignment("justify")}
        className={
          editor.isActive({ textAlign: "justify" }) ||
          editor.isActive("image", { textAlign: "justify" })
            ? "is-active"
            : ""
        }
        variant="ghost"
        size="icon"
        aria-label="Align Justify"
      >
        <AlignJustifyIcon className="w-4 h-4" />
      </Button>

      {/* Image Controls - Show when image is selected */}
      {showImageControls && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Image Size Controls */}
          <Select onValueChange={resizeImage}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25%">25%</SelectItem>
              <SelectItem value="50%">50%</SelectItem>
              <SelectItem value="75%">75%</SelectItem>
              <SelectItem value="100%">100%</SelectItem>
              <SelectItem value="200px">200px</SelectItem>
              <SelectItem value="300px">300px</SelectItem>
              <SelectItem value="400px">400px</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {/* Font Family Select */}
      <Select onValueChange={setFontFamily}>
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Helvetica">Helvetica</SelectItem>
          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          <SelectItem value="Georgia">Georgia</SelectItem>
          <SelectItem value="Courier New">Courier New</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        variant="ghost"
        size="icon"
        aria-label="Undo"
      >
        <UndoIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        variant="ghost"
        size="icon"
        aria-label="Redo"
      >
        <RedoIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function RichTextEditor({
  content: initialContent = "<p>Bắt đầu viết nội dung của bạn ở đây...</p>",
  onChange,
  placeholder,
  disabled = false,
  className,
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            textAlign: {
              default: null,
              parseHTML: (element) => element.style.textAlign || null,
              renderHTML: (attributes) => {
                if (!attributes.textAlign) return {};
                return {
                  style: `text-align: ${attributes.textAlign}; display: block;`,
                };
              },
            },
          };
        },
      }).configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      TextStyle,
      FontFamily,
    ],
    content: content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setContent(newContent);
      onChange?.(newContent);
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none p-4 min-h-[200px] overflow-y-auto [&_.editor-image]:cursor-pointer [&_.editor-image]:border-2 [&_.editor-image]:border-transparent [&_.editor-image:hover]:border-blue-300 [&_.editor-image.ProseMirror-selectednode]:border-blue-500 [&_a]:cursor-pointer [&_a:hover]:text-blue-600 [&_img[style*='text-align:_center']]:mx-auto [&_img[style*='text-align:_right']]:ml-auto [&_img[style*='text-align:_left']]:mr-auto",
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent !== content) {
      editor.commands.setContent(initialContent);
      setContent(initialContent);
    }
  }, [initialContent, editor, content]);

  return (
    <div className={cn("w-full mx-auto", className)}>
      <div className="border border-gray-200 rounded-md dark:border-gray-700">
        {!disabled && <TiptapToolbar editor={editor} />}
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
}
