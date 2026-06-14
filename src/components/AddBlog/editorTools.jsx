import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Table from "@editorjs/table";
import { success } from "zod";
// uploadImageByUrl from previous block (or import it)
const uploadImageByUrl = async (imageUrl) => {
  try {
    const res = await fetch("/api/editor-upload-by-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: imageUrl }),
    });
    return await res.json();
  } catch (err) {
    return { success: 0, message: err?.message ?? "Upload by URL failed" };
  }
};
const editorTools = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Enter a heading",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: EditorjsList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
      uploader: {
        /**
         * uploadByFile should be the function that accepts a File object when user
         * drags/drops or uses file selection. Your existing POST /api/editor-upload already supports form uploads.
         * If you don't use a JS function for uploadByFile, Editor.js will POST file to endpoints.byFile automatically.
         *
         * Example if you want to handle uploadByFile manually:
         * uploadByFile: async (file) => { ... call /api/editor-upload ... }
         */
        uploadByUrl: uploadImageByUrl,
      },
      endpoints: {
        byFile: "/api/editor-upload",
        // byUrl: "/api/editor-upload-url",
      },
      additionalFields: [
        {
          name: "alt", // our custom field
          placeholder: "Image alt text (for SEO)",
        },
      ],
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },
  code: {
    class: Code,
    config: {
      placeholder: "Write your code here...",
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
};

export default editorTools;
