import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import ImageResize from "tiptap-extension-resize-image";
import { uploadPhoto } from "../../api/write";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    try {
      // 파일 유효성 검사
      if (!file) {
        alert("파일이 선택되지 않았습니다.");
        return null;
      }

      // 파일 크기 체크 (10MB 제한)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert("파일 크기는 10MB 이하여야 합니다.");
        return null;
      }

      // 파일 타입 체크
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        alert("지원하지 않는 파일 형식입니다. 이미지(JPG, PNG, GIF, WebP) 또는 동영상(MP4, WebM, OGG) 파일만 업로드 가능합니다.");
        return null;
      }

      const formData = new FormData();
      formData.append("files", file);

      console.log("✅ 업로드할 파일:", file);
      console.log("✅ FormData 내용: files =", file.name, file.size, "bytes");

      const res = await uploadPhoto(formData);

      console.log("✅ 업로드된 파일 응답:", res);
      console.log("✅ 응답 데이터:", res.data);

      // 배열 형태의 응답에서 첫 번째 URL 추출
      let fileUrl = '';
      if (Array.isArray(res.data) && res.data.length > 0) {
        fileUrl = res.data[0];
      } else if (typeof res.data === 'string') {
        fileUrl = res.data;
      } else {
        console.error("❌ 예상과 다른 응답 형태:", res.data);
        alert(`예상과 다른 응답 형태입니다: ${JSON.stringify(res.data)}`);
        return null;
      }

      console.log("✅ 추출된 파일 URL:", fileUrl);

      return fileUrl;
    } catch (err: any) {
      console.error("❌ 파일 업로드 실패:", err);
      console.error("❌ 에러 응답:", err.response);
      console.error("❌ 에러 상태:", err.response?.status);
      console.error("❌ 에러 데이터:", err.response?.data);

      if (err.response?.status === 413) {
        alert("파일 크기가 너무 큽니다. 더 작은 파일을 업로드해주세요.");
      } else if (err.response?.status === 400) {
        alert("잘못된 파일 형식입니다. 이미지 또는 동영상 파일만 업로드 가능합니다.");
      } else if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else {
        alert(`파일 업로드 중 오류가 발생했습니다: ${err.response?.data?.message || err.message}`);
      }
      return null;
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      ImageResize,
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
  }, [editor, uploadFile]);

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
  /* height: 400px;  */
  min-height: 400px;
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

    /* 이미지 기본 스타일 */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      cursor: pointer;
      
      /* 선택된 이미지 스타일 */
      &.ProseMirror-selectednode {
        outline: 2px solid #68CEF8;
        border-radius: 8px;
      }
    }

    /* 이미지 리사이즈 핸들 스타일 */
    .image-resizer {
      position: relative;
      display: inline-block;
      
      .resize-trigger {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 1;
      }
      
      .resize-handle {
        position: absolute;
        background: #68CEF8;
        border: 2px solid #fff;
        border-radius: 4px;
        width: 12px;
        height: 12px;
        z-index: 2;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      .resize-handle--nw { top: -6px; left: -6px; cursor: nw-resize; }
      .resize-handle--ne { top: -6px; right: -6px; cursor: ne-resize; }
      .resize-handle--sw { bottom: -6px; left: -6px; cursor: sw-resize; }
      .resize-handle--se { bottom: -6px; right: -6px; cursor: se-resize; }
    }

    &:empty::before {
      content: attr(data-placeholder);
      color: #aaa;
    }
  }
`;
