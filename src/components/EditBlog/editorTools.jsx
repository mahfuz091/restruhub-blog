import Header from "@editorjs/header";
import EditorjsList from '@editorjs/list';
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Table from "@editorjs/table";

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
        defaultStyle: 'unordered'
      },
    },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
      
      endpoints: {
        byFile: "/api/editor-upload", 
        byUrl: "/api/editor-upload-url",
      },
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
