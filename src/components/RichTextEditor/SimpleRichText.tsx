import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  QuoteIcon,
  CodeXmlIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  UndoIcon,
  RedoIcon,
} from "lucide-react";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimpleRichTextProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SimpleRichText({
  value,
  onChange,
  disabled,
  className,
}: SimpleRichTextProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const text = (editor.getText() || "").replace(/\u00a0/g, " ").trim();
      const html = editor.getHTML();
      onChange(text.length === 0 ? "" : html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== undefined && value !== current) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL", prev || "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const handle = () => forceUpdate((n) => n + 1);
    editor.on("selectionUpdate", handle);
    editor.on("transaction", handle);
    return () => {
      editor.off("selectionUpdate", handle);
      editor.off("transaction", handle);
    };
  }, [editor]);

  const currentFont =
    (editor?.getAttributes("textStyle")?.fontFamily as string) || "default";

  return (
    <div className={`rounded-md border border-input ${className ?? ""}`}>
      <div className="flex flex-wrap gap-1 p-1">
        <Select
          value={currentFont}
          onValueChange={(val) => {
            if (!editor) return;
            if (val === "default") {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(val).run();
            }
          }}
        >
          <SelectTrigger className="h-8 w-40">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Mặc định</SelectItem>
            <SelectItem value="system-ui">System UI</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="monospace">Monospace</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="sans-serif">Sans Serif</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={editor && editor.isActive("bold") ? "is-active" : ""}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor?.can().chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={editor && editor.isActive("italic") ? "is-active" : ""}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor?.can().chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={editor && editor.isActive("strike") ? "is-active" : ""}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editor?.can().chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
        >
          <StrikethroughIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor && editor.isActive("heading", { level: 1 })
              ? "is-active"
              : ""
          }
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          aria-label="Heading 1"
        >
          <Heading1Icon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor && editor.isActive("heading", { level: 2 })
              ? "is-active"
              : ""
          }
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Heading 2"
        >
          <Heading2Icon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor && editor.isActive("heading", { level: 3 })
              ? "is-active"
              : ""
          }
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Heading 3"
        >
          <Heading3Icon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={editor && editor.isActive("bulletList") ? "is-active" : ""}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          aria-label="Bulleted list"
        >
          <ListIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor && editor.isActive("orderedList") ? "is-active" : ""
          }
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
        >
          <ListOrderedIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={editor && editor.isActive("blockquote") ? "is-active" : ""}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          aria-label="Blockquote"
        >
          <QuoteIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={editor && editor.isActive("codeBlock") ? "is-active" : ""}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          aria-label="Code block"
        >
          <CodeXmlIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={editor && editor.isActive("link") ? "is-active" : ""}
          onClick={setLink}
          aria-label="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor && editor.isActive({ textAlign: "left" }) ? "is-active" : ""
          }
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          aria-label="Align left"
        >
          <AlignLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor && editor.isActive({ textAlign: "center" })
              ? "is-active"
              : ""
          }
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          aria-label="Align center"
        >
          <AlignCenterIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor && editor.isActive({ textAlign: "right" }) ? "is-active" : ""
          }
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          aria-label="Align right"
        >
          <AlignRightIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor && editor.isActive({ textAlign: "justify" })
              ? "is-active"
              : ""
          }
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
          aria-label="Align justify"
        >
          <AlignJustifyIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().chain().focus().undo().run()}
          aria-label="Undo"
        >
          <UndoIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().chain().focus().redo().run()}
          aria-label="Redo"
        >
          <RedoIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-px bg-border" />

      <div className="p-2">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none min-h-40 focus:outline-none"
        />
      </div>
    </div>
  );
}
