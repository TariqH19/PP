import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

const FileInput = ({
  setContent,
  label,
  isTextInput,
  setFileName,
  fileName,
}) => {
  const [text, setText] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setContent(reader.result);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    setContent(event.target.value);
  };

  return (
    <Box mb={3}>
      <Typography variant="h6">{label}</Typography>
      {isTextInput ? (
        <TextField
          label={`Paste ${label} content`}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={text}
          onChange={handleTextChange}
        />
      ) : (
        <Box>
          <Button variant="contained" component="label">
            Choose File
            <input
              type="file"
              accept=".txt,.js,.html" // adjust according to your needs
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {fileName && (
            <Typography variant="body1" color="textSecondary">
              {fileName}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FileInput;
