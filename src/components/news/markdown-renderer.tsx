"use client";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Split content into blocks (double newline = paragraph break)
  const blocks = content.trim().split(/\n\n+/);

  const renderBlock = (block: string, index: number) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Check for headers
    if (trimmed.startsWith("# ")) {
      return (
        <h1 key={index} className="mb-4 mt-8 text-3xl font-bold text-[#001B34] first:mt-0">
          {trimmed.substring(2)}
        </h1>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={index} className="mb-3 mt-6 text-2xl font-bold text-[#001B34] first:mt-0">
          {trimmed.substring(3)}
        </h2>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={index} className="mb-2 mt-5 text-xl font-semibold text-[#001B34] first:mt-0">
          {trimmed.substring(4)}
        </h3>
      );
    }

    // Check for lists
    const listPattern = /^[-•]\s|^\d+\.\s/;
    if (trimmed.match(listPattern)) {
      const lines = trimmed.split(/\n(?=[-•]|\d+\.)/);
      const isOrdered = trimmed.match(/^\d+\.\s/);
      const ListTag = isOrdered ? "ol" : "ul";

      return (
        <ListTag
          key={index}
          className="mb-4 ml-6 list-outside space-y-2 first:mt-0"
          style={isOrdered ? { listStyleType: "decimal" } : { listStyleType: "disc" }}
        >
          {lines.map((item, idx) => {
            const cleanItem = item.replace(/^[-•]\s+|\d+\.\s+/, "").trim();
            // Handle bold text
            const parts = cleanItem.split(/(\*\*.*?\*\*)/g);
            return (
              <li key={idx} className="leading-relaxed text-slate-700">
                {parts.map((part, pIdx) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={pIdx} className="font-semibold text-[#001B34]">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    <span key={pIdx}>{part}</span>
                  )
                )}
              </li>
            );
          })}
        </ListTag>
      );
    }

    // Regular paragraph
    const parts = trimmed.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return (
      <p key={index} className="mb-4 leading-relaxed text-slate-700 first:mt-0">
        {parts.map((part, idx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={idx} className="font-semibold text-[#001B34]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("*") && part.endsWith("*") && part.length > 1 && !part.startsWith("**")) {
            return <em key={idx} className="italic">{part.slice(1, -1)}</em>;
          }
          return <span key={idx}>{part}</span>;
        })}
      </p>
    );
  };

  return (
    <div className="space-y-1">
      {blocks.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
}
