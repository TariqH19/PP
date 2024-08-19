// src/components/CodeDisplay.js

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeDisplay = ({ title, language, code }) => {
  return (
    <div style={{ margin: "20px 0" }}>
      <h2>{title}</h2>
      <SyntaxHighlighter language={language} style={okaidia}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeDisplay;
