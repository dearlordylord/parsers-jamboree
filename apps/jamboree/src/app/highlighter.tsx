import React from 'react';
import hljs from 'highlight.js';
// const hljs = require('highlight.js/lib/core'); TODO

type HighlighterProps = {
  content: string;
  language: 'typescript' | 'json';
}
export const Highlighter = ({
                              content,
  language,
                            }: HighlighterProps): React.ReactElement => {
  return (
    <pre className="hljs">
      <code dangerouslySetInnerHTML={{ __html: hljs.highlight(language, content).value }} />
    </pre>
  );
}
