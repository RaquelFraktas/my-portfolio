import ReactMarkdown from "react-markdown";

// Raw HTML inside a post is shown as text, never rendered, and react-markdown
// strips unsafe link URLs (javascript: etc.), so a post can't inject scripts.
function SafeLink({ href, children, ...props }) {
  const external = href && /^https?:\/\//.test(href);
  return (
    <a href={href} {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

export default function Markdown({ children }) {
  return (
    <div className="markdown">
      <ReactMarkdown skipHtml components={{ a: SafeLink }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
