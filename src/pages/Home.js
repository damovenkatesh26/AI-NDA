import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PdfViewer from "./PdfView";
import ShowHtml from "./ShowHtml";
import UploadPdfModal from "./UploadPdfModal";
import PDFIcon from "../img/pdf_icon.png";

const Home = () => {
  const [pdfFile, setPdfFile] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handlePdfUpload = (newPdf) => {
    setPdfFile(newPdf.url);
    setShowModal(false);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" width="100%">
      {/* Top Bar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        borderBottom="1px solid #ddd"
        bgcolor="#f0f2f5"
      >
        <Typography
          variant="h6"
          fontWeight={600}
          display="flex"
          alignItems="center"
          color="#2d3436"
        >
          <img
            src={PDFIcon}
            alt="PDF"
            style={{ width: 20, height: 20, marginRight: 8 }}
          />
          AI NDA PDF Parser
        </Typography>
        <Button
          startIcon={<UploadFileIcon />}
          variant="contained"
          sx={{
            backgroundColor: "#6c5ce7",
            borderRadius: 2,
            textTransform: "none",
          }}
          onClick={() => setShowModal(true)}
        >
          Upload PDF
        </Button>
      </Box>

      {/* Main Content */}
      <Box display="flex" flex={1} overflow="hidden">
        {/* PDF Viewer */}
        <Box
          flex={1}
          p={3}
          sx={{
            bgcolor: "#ffffff",
            borderRight: "1px solid #eee",
            overflowY: "auto",
          }}
        >
          {pdfFile ? (
            <PdfViewer file={pdfFile} />
          ) : (
            <Typography color="textSecondary">No PDF uploaded yet</Typography>
          )}
        </Box>

        {/* HTML Viewer */}
        <Box flex={1} p={3} bgcolor="#f9f8fd" overflow="auto">
          <ShowHtml pdfFile={pdfFile} />
        </Box>
      </Box>

      {/* Upload Dialog */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload PDF</DialogTitle>
        <UploadPdfModal
          onUpload={handlePdfUpload}
          onClose={() => setShowModal(false)}
        />
      </Dialog>
    </Box>
  );
};

export default Home;
