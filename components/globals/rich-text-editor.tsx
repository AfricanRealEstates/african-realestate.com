"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { EditorState } from "draft-js";
import { Editor as TheEditor } from "react-draft-wysiwyg";
import { EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default forwardRef<Object, EditorProps>(function RichTextEditor(
  props,
  ref
) {
  return (
    <Editor
      editorClassName={cn(
        "border rounded-md px-3 min-h-[150px] cursor-text ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        props.editorClassName
      )}
      toolbar={{
        history: { inDropdown: true },
        options: ["inline", "list", "link", "history"],

        inline: {
          options: ["bold", "italic", "underline", "strikethrough"],
        },
        blockType: {
          options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
        },
        list: {
          options: ["unordered", "ordered"],
        },
        textAlign: {
          options: ["left", "center", "right", "justify"],
        },
        link: {
          options: ["link"],
        },
        embedded: {
          options: ["embedded"],
        },
        image: {
          previewImage: true,
        },
      }}
      editorRef={(r) => {
        if (typeof ref === "function") {
          ref(r);
        } else if (ref) {
          ref.current = r;
        }
      }}
      {...props}
    />
  );
});
// "use client";
// import React, { forwardRef, useState } from "react";
// import dynamic from "next/dynamic";
// import FroalaEditor from "react-froala-wysiwyg";
// import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
// import "froala-editor/css/froala_style.min.css";
// import "froala-editor/css/froala_editor.pkgd.min.css";
// import "froala-editor/js/plugins/image.min.js";
// import "froala-editor/js/plugins/char_counter.min.js";
// import "froala-editor/js/plugins/save.min.js";

// const Editor = dynamic(
//   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
//   { ssr: false }
// );

// export default forwardRef<Object>(function RichTextEditor(props, ref) {
//   const [model, setModel] = useState(() => {
//     return localStorage.getItem("savedHtml") || "";
//   });
//   return (
//     <>
//       <FroalaEditor
//         model={model}
//         onModelChange={(e: string) => setModel(e)}
//         config={{
//           placeholderText: "Please start writing your blog",
//           charCounterCount: true,
//           charCounterMax: 5000,
//           saveInterval: 2000,
//           events: {
//             "charCounter.exceeded": function () {
//               alert("You have exceeded the maximum allowed characters.");
//             },
//             "save.before": function (html: string) {
//               localStorage.setItem("savedHtml", html);
//             },
//           },
//         }}
//         tag="textarea"
//       />
//       <FroalaEditorView />
//     </>
//   );
// });
