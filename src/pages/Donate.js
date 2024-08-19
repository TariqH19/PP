import React, { useState } from "react";
import CodeDisplay from "../components/CodeDisplay";

const donateHtmlCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PayPal Donate Integration</title>
    <script
      src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
      charset="UTF-8"
    ></script>
  </head>
  <body>
    <div id="paypal-donate-button-container"></div>

    <script>
      PayPal.Donation.Button({
        env: "sandbox",
        hosted_button_id: "UET2FC4CLPEDU",
        image: {
          src: "https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif",
          title: "PayPal - The safer, easier way to pay online!",
          alt: "Donate with PayPal button",
        },
        onComplete: function (params) {
          console.log("Donation completed:", params);
        },
      }).render("#paypal-donate-button-container");
    </script>
  </body>
</html>`;

const serverJsCode = `import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { PORT = 8888 } = process.env;
const app = express();

app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

app.get("/donate", (req, res) => {
  res.sendFile(path.resolve("../client/donate.html"));
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`;

const envCode = `PORT=8888`;

const packageJsonCode = `{
  "name": "paypal-donation",
  "version": "1.0.0",
  "description": "PayPal Donation Integration",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.0"
  }
}`;

export default function DonateDisplay() {
  const [selectedFile, setSelectedFile] = useState(null);

  const files = [
    { name: "Donate.html", code: donateHtmlCode, language: "html" },
    { name: "Server.js", code: serverJsCode, language: "javascript" },
    { name: ".env", code: envCode, language: "bash" },
    { name: "package.json", code: packageJsonCode, language: "json" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>PayPal Donation Integration - Code Samples</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => setSelectedFile(file)}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}>
            {file.name}
          </button>
        ))}
      </div>
      {selectedFile && (
        <CodeDisplay
          title={selectedFile.name}
          language={selectedFile.language}
          code={selectedFile.code}
        />
      )}
    </div>
  );
}
