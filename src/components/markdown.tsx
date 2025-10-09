import clsx from "clsx";

type MarkdownProps = {
  content?: string | null;
  className?: string;
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(text: string) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[(.+?)\]\((https?:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  return html;
}

function renderMarkdown(content: string) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const htmlBlocks = blocks.map((rawBlock) => {
    const block = rawBlock.trim();
    if (!block) {
      return "";
    }
    const lines = block.split("\n");
    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      const items = lines
        .map((line) => line.replace(/^[-*]\s+/, ""))
        .map((item) => `<li>${formatInline(item)}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }
    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      const items = lines
        .map((line) => line.replace(/^\d+\.\s+/, ""))
        .map((item) => `<li>${formatInline(item)}</li>`)
        .join("");
      return `<ol>${items}</ol>`;
    }
    return `<p>${formatInline(lines.join("<br/>"))}</p>`;
  });
  return htmlBlocks.join("");
}

export function Markdown({ content, className }: MarkdownProps) {
  if (!content) {
    return null;
  }
  const html = renderMarkdown(content);
  return (
    <div
      className={clsx(
        "space-y-3 text-sm leading-relaxed text-slate-300 [&>p]:text-inherit [&>ul]:list-disc [&>ul]:ps-5 [&>ol]:list-decimal [&>ol]:ps-5 [&>strong]:text-slate-100",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
