import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { useEffect, useRef } from "react";
import styled from "styled-components";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "ProseMirror",
        "data-placeholder": "내용을 입력하세요...",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 드래그 앤 드롭 이벤트 처리
  useEffect(() => {
    if (!editor) return;

    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();

      const file = event.dataTransfer?.files?.[0];
      if (!file) return;

      const url = await uploadFile(file);
      if (!url) return;

      if (file.type.startsWith("image/")) {
        editor.chain().focus().setImage({ src: url }).run();
      } else if (file.type.startsWith("video/")) {
        const videoTag = `<video src="${url}" controls width="100%" />`;
        editor.commands.insertContent(videoTag);
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("drop", handleDrop);

    return () => dom.removeEventListener("drop", handleDrop);
  }, [editor]);

  const handleLocalUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const url = await uploadFile(file);
    if (!url) return;

    if (file.type.startsWith("image/")) {
      editor.chain().focus().setImage({ src: url }).run();
    } else if (file.type.startsWith("video/")) {
      const videoTag = `<video src="${url}" controls width="100%" />`;
      editor.commands.insertContent(videoTag);
    }

    e.target.value = ""; // 동일 파일 재업로드 허용
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.url;
    } catch (err) {
      console.error("❌ 파일 업로드 실패:", err);
      alert("파일 업로드 중 오류가 발생했습니다.");
      return null;
    }
  };

  if (!editor) return null;

  return (
    <EditorWrapper>
      <Toolbar>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          U
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>
          S
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          “”
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          onClick={() => {
            const url = window.prompt("링크 URL을 입력하세요");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          🔗
        </button>
        <button onClick={handleLocalUpload}>🖼️📹 업로드</button>
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Toolbar>

      <EditorContentWrapper onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </EditorContentWrapper>
    </EditorWrapper>
  );
};

export default TiptapEditor;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px; /* 에디터 전체 높이 고정 */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 6px;
  border-bottom: 1px solid #eee;
  padding: 6px;
  background-color: white;

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 4px 6px;
    border-radius: 4px;

    &:hover {
      background-color: #f2f2f2;
    }
  }
`;

const EditorContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;

  .ProseMirror {
    padding: 16px;
    outline: none;
    min-height: 100%;
    height: 100%;
    cursor: text;
    box-sizing: border-box;

    display: block;

    &:empty::before {
      content: attr(data-placeholder);
      color: #aaa;
    }
  }
`;
