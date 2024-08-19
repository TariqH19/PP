import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import FileInput from "../components/Fileinput";
import ComparisonResult from "../components/ComparisonResult";
import * as Diff from "diff";

function Filecomp() {
  const [file1Content, setFile1Content] = useState("");
  const [file2Content, setFile2Content] = useState("");
  const [text1Content, setText1Content] = useState("");
  const [text2Content, setText2Content] = useState("");
  const [file1Name, setFile1Name] = useState("");
  const [file2Name, setFile2Name] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);
  const [filesIdentical, setFilesIdentical] = useState(null);
  const [inputMode, setInputMode] = useState("file-file"); // Default to file-file mode

  const handleTabChange = (event, newValue) => {
    setInputMode(newValue);
  };

  const compareContent = () => {
    let diff;
    if (inputMode === "file-file") {
      diff = Diff.diffWords(file1Content, file2Content);
    } else if (inputMode === "text-text") {
      diff = Diff.diffWords(text1Content, text2Content);
    } else if (inputMode === "file-text") {
      diff = Diff.diffWords(file1Content, text1Content);
    }
    setComparisonResult(diff);

    // Check if contents are identical
    const areContentsIdentical = diff.every(
      (part) => !part.added && !part.removed
    );
    setFilesIdentical(areContentsIdentical);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Compare Tool
        </Typography>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Tabs
            value={inputMode}
            onChange={handleTabChange}
            variant="fullWidth">
            <Tab label="File vs File" value="file-file" />
            <Tab label="Text vs Text" value="text-text" />
            <Tab label="File vs Text" value="file-text" />
          </Tabs>
          <Grid container spacing={3} mt={2}>
            {inputMode === "file-file" && (
              <>
                <Grid item xs={12} sm={6}>
                  <FileInput
                    setContent={setFile1Content}
                    label="File 1"
                    isTextInput={false}
                    setFileName={setFile1Name}
                    fileName={file1Name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FileInput
                    setContent={setFile2Content}
                    label="File 2"
                    isTextInput={false}
                    setFileName={setFile2Name}
                    fileName={file2Name}
                  />
                </Grid>
              </>
            )}
            {inputMode === "text-text" && (
              <>
                <Grid item xs={12} sm={6}>
                  <FileInput
                    setContent={setText1Content}
                    label="Text 1"
                    isTextInput={true}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FileInput
                    setContent={setText2Content}
                    label="Text 2"
                    isTextInput={true}
                  />
                </Grid>
              </>
            )}
            {inputMode === "file-text" && (
              <>
                <Grid item xs={12} sm={6}>
                  <FileInput
                    setContent={setFile1Content}
                    label="File"
                    isTextInput={false}
                    setFileName={setFile1Name}
                    fileName={file1Name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FileInput
                    setContent={setText1Content}
                    label="Text"
                    isTextInput={true}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={compareContent}
              disabled={
                (inputMode === "file-file" &&
                  (!file1Content || !file2Content)) ||
                (inputMode === "text-text" &&
                  (!text1Content || !text2Content)) ||
                (inputMode === "file-text" && (!file1Content || !text1Content))
              }>
              Compare
            </Button>
          </Box>
        </Paper>
        {filesIdentical !== null && (
          <Box mt={3} textAlign="center">
            <Typography variant="h6" color={filesIdentical ? "green" : "red"}>
              {filesIdentical
                ? "Contents are identical"
                : "Contents are different"}
            </Typography>
          </Box>
        )}
        {comparisonResult && (
          <Box mt={4}>
            <ComparisonResult result={comparisonResult} />
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Filecomp;
