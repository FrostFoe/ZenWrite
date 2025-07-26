
// @ts-nocheck
import CheckList from "@editorjs/checklist";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";

export const EDITOR_TOOLS = {
  header: {
    class: Header,
    inlineToolbar: true,
  },
  list: List,
  checklist: CheckList,
  quote: Quote,
  table: Table,
  inlineCode: InlineCode,
  marker: Marker,
};
