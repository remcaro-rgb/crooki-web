import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

// Minimal Markdown renderer for the legal docs in src/content/legal.ts.
// Supports: "## " headings, "- " and "1. " lists, paragraphs, **bold**,
// [text](url) links and bare https:// URLs.

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+[^\s).,])/g;

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<strong key={key++}>{renderInline(m[1])}</strong>);
    } else {
      const label = m[2] ?? m[4];
      const href = m[3] ?? m[4];
      out.push(
        href.startsWith("/") ? (
          <Link key={key++} href={href} className="underline hover:text-[#8b0031]">
            {label}
          </Link>
        ) : (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline break-all hover:text-[#8b0031]"
          >
            {label}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function LegalMarkdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);

  return (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-black text-gray-900 pt-4">
              {block.slice(3)}
            </h2>
          );
        }
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc pl-6 space-y-1">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.slice(2))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\d+\. /.test(l))) {
          return (
            <ol key={i} className="list-decimal pl-6 space-y-1">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\d+\. /, ""))}</li>
              ))}
            </ol>
          );
        }
        return <p key={i}>{renderInline(block)}</p>;
      })}
    </div>
  );
}
