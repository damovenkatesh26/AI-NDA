import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";
import PropTypes from "prop-types";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.mjs";

const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState(null);
  const [zoom, setZoom] = useState(0.9);
  const containerRef = useRef();
  const pageRefs = useRef([]);

  // Extract the file name from string or File object
  const fileName =
    typeof file === "string"
      ? file.split("/").pop()
      : file?.name || "Document";

  useEffect(() => {
    setCurrentPage(1);
    pageRefs.current = [];
  }, [file]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const pageIndex = pageRefs.current.findIndex(
            (ref) => ref === visibleEntry.target
          );
          if (pageIndex !== -1) setCurrentPage(pageIndex + 1);
        }
      },
      { threshold: 0.6 }
    );

    pageRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => {
      pageRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [numPages]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f4f4f4",
      }}
    >
      {/* Sticky Bottom Toolbar */}
      <Box
        sx={{
          p: 1.5,
          backgroundColor: "#fafafa",
          position: "sticky",
          bottom: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <Typography variant="body2" noWrap title={fileName}>
          PDF View
        </Typography>
        <Typography variant="body2">
          Page {currentPage} / {numPages}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleZoomOut}>
            <ZoomOut fontSize="small" />
          </IconButton>
          <Typography variant="body2">{Math.round(zoom * 100)}%</Typography>
          <IconButton onClick={handleZoomIn}>
            <ZoomIn fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable Area */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 1,
        }}
      >
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<Typography>Loading PDF...</Typography>}
          error={<Typography color="error">Failed to load PDF.</Typography>}
        >
          {numPages &&
            Array.from(new Array(numPages), (_, index) => (
              <Paper
                key={`page_${index + 1}`}
                ref={(el) => (pageRefs.current[index] = el)}
                elevation={3}
                sx={{
                  my: 2,
                  mx: "auto",
                  p: 1,
                  width: "fit-content",
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  backgroundColor: "#fff",
                }}
              >
                <Page
                  pageNumber={index + 1}
                  width={containerWidth ? containerWidth * zoom : undefined}
                />
              </Paper>
            ))}
        </Document>
      </Box>
    </Box>
  );
};

PdfViewer.propTypes = {
  file: PropTypes.any.isRequired,
};

export default PdfViewer;
