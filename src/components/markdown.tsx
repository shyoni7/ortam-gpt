import clsx from "clsx";
import ReactMarkdown from "react-markdown";

type MarkdownProps = {
  content?: string | null;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  if (!content) {
    return null;
  }
  return (
    <div
      className={clsx(
        "space-y-3 text-sm leading-relaxed text-slate-300 [&>p]:text-inherit [&>ul]:list-disc [&>ul]:ps-5 [&>ol]:list-decimal [&>ol]:ps-5 [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:text-primary-200 [&>strong]:text-slate-100",
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
