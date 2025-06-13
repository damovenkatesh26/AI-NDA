// src/components/UploadPdfModal.jsx
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDropzone } from "react-dropzone";

const UploadPdfModal = ({ visible, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setError("Only PDF files are allowed.");
      setFile(null);
    } else if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [] },
    multiple: false,
    onDrop,
  });

  const handleSubmit = () => {
    if (!file) {
      setError("PDF file is required.");
      return;
    }

    const url = URL.createObjectURL(file);
    onUpload({ name: file.name, url });
    setFile(null);
    setError("");
    onClose();
  };

  return (
    <Dialog open={visible} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Upload PDF</DialogTitle>

      <DialogContent dividers>
        <Paper
          variant="outlined"
          {...getRootProps()}
          sx={{
            p: 4,
            border: "2px dashed #ccc",
            textAlign: "center",
            backgroundColor: isDragActive ? "#f0f0f0" : "#fafafa",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <input {...getInputProps()} />
          <Box display="flex" flexDirection="column" alignItems="center">
            <UploadFileIcon sx={{ fontSize: 48, color: "text.secondary" }} />
            <Typography variant="body1" mt={1}>
              {isDragActive
                ? "Drop the PDF here..."
                : "Click or drag PDF file to this area to upload"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Only PDF files are accepted.
            </Typography>
            {file && (
              <Typography variant="body2" mt={2}>
                Selected file: <strong>{file.name}</strong>
              </Typography>
            )}
          </Box>
        </Paper>
        {error && (
          <Typography color="error" variant="caption" mt={1}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} style = {{borderRadius:"15px",border:"1px solid"}}color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit}   style={{backgroundColor:"#6c5ce7",color:"white",borderRadius:"15px"}}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadPdfModal;
