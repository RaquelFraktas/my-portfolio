import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// Posts can mix markdown with HTML for styling: tags like <div>, <span>,
// <details>, plus style="" and class="" on any element.
// rehype-sanitize runs after the HTML is parsed and strips anything that could
// run code (<script>, <iframe>, on* handlers, javascript: URLs), so a post can
// style itself but never inject scripts into the public blog.
const schema = {
  ...defaultSchema,
  tagNames: [
    ...defaultSchema.tagNames,
    "span", "mark", "small", "u", "abbr", "figure", "figcaption",
    "section", "aside", "header", "footer", "center",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes["*"] ?? []), "className", "style"],
    img: [...(defaultSchema.attributes.img ?? []), "width", "height", "loading"],
  },
};

// `node` is react-markdown's syntax-tree node, not an HTML attribute
// eslint-disable-next-line no-unused-vars
function SafeLink({ node, href, children, ...props }) {
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
      <ReactMarkdown rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]} components={{ a: SafeLink }}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
