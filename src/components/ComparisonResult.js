import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";

const ComparisonResult = ({ result }) => {
  // Count differences
  const addedCount = result.filter((part) => part.added).length;
  const removedCount = result.filter((part) => part.removed).length;
  const unchangedCount = result.filter(
    (part) => !part.added && !part.removed
  ).length;

  return (
    <Paper
      elevation={1}
      style={{
        padding: "16px",
        maxHeight: "500px",
        overflowY: "auto",
        border: "1px solid #e0e0e0",
      }}>
      {/* Summary Stats */}
      <Box mb={2} display="flex" gap={1} flexWrap="wrap">
        <Chip
          label={`${addedCount} additions`}
          size="small"
          sx={{ backgroundColor: "#c8e6c9", color: "#2e7d32" }}
        />
        <Chip
          label={`${removedCount} deletions`}
          size="small"
          sx={{ backgroundColor: "#ffcdd2", color: "#c62828" }}
        />
        <Chip
          label={`${unchangedCount} unchanged`}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Legend */}
      <Box mb={2} p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}>
        <Typography variant="body2" fontWeight="bold" mb={1}>
          Legend:
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#c8e6c9",
                borderRadius: 1,
              }}></Box>
            <Typography variant="body2">
              Content in your file (not in PayPal's)
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#ffcdd2",
                borderRadius: 1,
              }}></Box>
            <Typography variant="body2">
              Content in PayPal's file (missing from yours)
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Diff Content */}
      <Box
        component="pre"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          backgroundColor: "#fafafa",
          padding: "12px",
          borderRadius: "8px",
          overflowX: "auto",
          fontSize: "12px",
          fontFamily: "monospace",
          lineHeight: 1.4,
          border: "1px solid #e0e0e0",
        }}>
        {result.map((part, index) => {
          const style = {
            backgroundColor: part.added
              ? "#c8e6c9" // Softer green for additions
              : part.removed
              ? "#ffcdd2" // Softer red for deletions
              : "transparent", // Unchanged text
            textDecoration: part.removed ? "line-through" : "none",
            padding: "1px 3px",
            borderRadius: "3px",
            display: "inline",
            margin: "0",
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
