import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import PdfViewer from "./PdfView";
import ShowHtml from "./ShowHtml";
import confidentiality_and_non_disclosure_agreement from "../img/confidentiality_and_non-disclosure-agreement.pdf";
import movie_film_nda from "../img/Movie-Film-Non-Disclosure-Agreement.pdf";
import vendor_nda from "../img/QU_CNDA-Mutual-Vendors_2011-05-12.pdf";
import textile_nda from "../img/Textile-Exchange-NDA-CFMB-2022-Fillable.pdf";
import tutor_perini_nda from "../img/tutor-perini-view-only-cui-non-disclosure-agreement-template-v5.pdf";
import PDFIcon from "../img/pdf_icon.png";
import UploadPdfModal from "./UploadPdfModal";

const Home = () => {
  const [pdfFile, setPdfFile] = useState(movie_film_nda);
  const [pdfList, setPdfList] = useState([
    { name: "Confidentiality NDA", url: confidentiality_and_non_disclosure_agreement },
    { name: "Movie NDA", url: movie_film_nda },
    { name: "Vendor NDA", url: vendor_nda },
    { name: "Textile NDA", url: textile_nda },
    { name: "Tutor NDA", url: tutor_perini_nda },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handlePdfSelect = (url) => {
    setPdfFile(url);
  };

  const handlePdfUpload = (newPdf) => {
    setPdfList((prev) => [newPdf, ...prev]);
    setPdfFile(newPdf.url);
  };

  return (
    <Box display="flex" minHeight="100vh" width="100%">
      {/* Sidebar */}
      {sidebarOpen && (
        <Box
          width={300}
          minWidth={300}
          display="flex"
          flexDirection="column"
          bgcolor="#f0f2f5"
          sx={{
            borderRight: "1px solid #ccc",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
            py={1.5}
            borderBottom="1px solid #ddd"
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
            <IconButton size="small" onClick={() => setSidebarOpen(false)}>
              <MenuOpenIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Upload Button */}
          <Box px={2} pt={2}>
            <Button
              startIcon={<UploadFileIcon />}
              variant="contained"
              fullWidth
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

          {/* PDF List */}
          <Box px={2} pt={2} flex={1} overflow="auto">
            <Typography variant="subtitle2" gutterBottom>
              PDF List
            </Typography>
            <List dense>
              {pdfList.map((pdf, index) => (
                <ListItem
                  button
                  
                  key={`${pdf.name}-${index}`}
                  onClick={() => handlePdfSelect(pdf.url)}
                  sx={{
                    backgroundColor:
                      pdfFile === pdf.url ? "#e0dfff" : "transparent",
                    color: "#333",
                    borderRadius: 1,
                    mb: 0.5,
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: "#d5d0f5",
                    },
                    cursor:"pointer"
                  }}
                >
                  <img
                    src={PDFIcon}
                    alt="PDF"
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                 <ListItemText
  primary={
    <Typography
      variant="body2"
      noWrap
      title={pdf.name}
      sx={{ maxWidth: "200px" }}
    >
      {pdf.name}
    </Typography>
  }
/>

                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      )}

      {/* Collapsed Sidebar Toggle */}
      {!sidebarOpen && (
        <Box
          width={50}
          minWidth={50}
          bgcolor="#f0f2f5"
          sx={{ borderRight: "1px solid #ccc" }}
        >
          <IconButton onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}

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
          <PdfViewer file={pdfFile} />
        </Box>

        {/* HTML Preview */}
        <Box
          flex={1}
          p={3}
          sx={{
            bgcolor: "#f9f8fd",
            overflowY: "auto",
          }}
        >
          <ShowHtml />
        </Box>
      </Box>

      {/* Upload Modal */}
      <UploadPdfModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onUpload={handlePdfUpload}
      />
    </Box>
  );
};

export default Home;
