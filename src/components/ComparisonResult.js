import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ComparisonResult = ({ result }) => {
  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxHeight: "400px", overflowY: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Comparison Result
      </Typography>
      <Box
        component="pre"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "5px",
          overflowX: "auto",
        }}>
        {result.map((part, index) => {
          const style = {
            backgroundColor: part.added
              ? "lightgreen" // Highlight added text with green
              : part.removed
              ? "salmon" // Highlight removed text with red
              : "white", // Unchanged text remains white
            textDecoration: part.removed ? "line-through" : "none",
            padding: "2px 4px",
            borderRadius: "4px",
            display: "inline-block",
            margin: "2px 0",
            maxWidth: "100%",
          };
          return (
            <span key={index} style={style}>
              {part.value}
            </span>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ComparisonResult;
