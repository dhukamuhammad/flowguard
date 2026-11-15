"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import TinyMCE Editor to guarantee zero SSR hydration mismatches
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[440px] w-full border border-gray-300 rounded-[6px] bg-gray-50/60 flex flex-col items-center justify-center gap-2 text-gray-500 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#E53935]" />
        <span className="font-medium text-gray-600">
          Loading TinyMCE Editor...
        </span>
        <span className="text-[11px] text-gray-400">
          WYSIWYG Rich Text Engine
        </span>
      </div>
    ),
  }
);

const TINYMCE_API_KEY =
  process.env.NEXT_PUBLIC_TINYMCE_API_KEY ||
  "bh3dkf7dq6x8qqpcumphpgwad92mar5ky71n0l1z1yc0rgu2";

export default function BlogDescriptionEditor({
  value = "",
  onChange,
  disabled = false,
}) {
  return (
    <div className="border border-gray-300 rounded-[6px] overflow-hidden bg-white shadow-2xs font-roboto">
      <Editor
        apiKey={TINYMCE_API_KEY}
        disabled={disabled}
        value={value}
        onEditorChange={(content) => onChange?.(content)}
        init={{
          height: 440,
          menubar: false,
          branding: false,
          promotion: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic underline | forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | blockquote link table | " +
            "code preview fullscreen",
          block_formats:
            "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",
          content_style: `
            body {
              font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              font-size: 15px;
              line-height: 1.65;
              color: #374151;
              padding: 12px;
            }
            h1, h2, h3, h4 {
              color: #111827;
              font-weight: 700;
              margin-top: 1.25rem;
              margin-bottom: 0.5rem;
            }
            h1 { font-size: 1.75rem; }
            h2 { font-size: 1.4rem; }
            h3 { font-size: 1.2rem; }
            p { margin-bottom: 0.85rem; }
            ul, ol { padding-left: 1.5rem; margin-bottom: 0.85rem; }
            li { margin-bottom: 0.25rem; }
            blockquote {
              border-left: 4px solid #E53935;
              background-color: #FEF2F2;
              padding: 10px 14px;
              margin: 1rem 0;
              color: #4B5563;
              font-style: italic;
              border-radius: 0 4px 4px 0;
            }
            table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
            th, td { border: 1px solid #E5E7EB; padding: 8px 12px; }
            th { background-color: #F9FAFB; font-weight: 600; }
          `,
          placeholder:
            "Write your blog article description and full content here. Use Heading 2/3 for sections, bold, bullet points, quotes, etc.",
        }}
      />
    </div>
  );
}
