import { useEffect } from "react";
import "prismjs/themes/prism.css";
import Prism from "prismjs";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Dùng style của highlight.js

const detectLanguage = (code) => {
  const result = hljs.highlightAuto(code);
  return result.language || "plaintext";
};

const RenderContent = ({ content }) => {
  useEffect(() => {
    setTimeout(() => {
      Prism.highlightAll();
    }, 100);
  }, [content]);

  return (
    <div className="prose max-w-none">
      <div
        dangerouslySetInnerHTML={{
          __html: content.replace(
            /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
            (match, code) => {
              const lang = detectLanguage(code);
              return `<pre><code class="language-${lang}">${code}</code></pre>`;
            }
          ),
        }}
      />
    </div>
  );
};

export default RenderContent;
