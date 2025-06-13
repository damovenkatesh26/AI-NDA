// src/pages/ShowHtml.jsx
import React, { useState, useRef } from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Autocomplete,
  TextField,
} from "@mui/material";

const rawHTML = `
  <h2>Invoice #12345</h2>
  <p><strong>Date:</strong> 2025-06-13</p>
  <p><strong>Customer:</strong> John Doe</p>
  <table border="1" cellpadding="6" cellspacing="0" style="width:100%; margin-top:10px;">
    <thead>
      <tr>
        <th>Item</th><th>Quantity</th><th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Widget A</td><td>2</td><td>$50.00</td>
      </tr>
      <tr>
        <td>Widget B</td><td>1</td><td>$30.00</td>
      </tr>
    </tbody>
  </table>
  <p><strong>Total:</strong> $130.00</p>
`;

const baseKeywords = [
  "Invoice", "Date", "Customer", "Widget A", "Widget B",
  "Quantity", "Price", "Total", "John Doe", "2025-06-13"
];

const ShowHtml = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(baseKeywords);
  const contentRef = useRef(null);

  const highlightHTML = (html, keyword) => {
    if (!keyword) return html;
    const escapedKeyword = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${escapedKeyword})`, "gi");
    return html.replace(regex, `<mark>$1</mark>`);
  };

  const highlightedHTML = highlightHTML(rawHTML, searchText);

  const handleSearch = () => {
    // Scroll to first highlighted element
    setTimeout(() => {
      const mark = contentRef.current?.querySelector("mark");
      if (mark) mark.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleInputChange = (event, value) => {
    setSearchText(value);
    const filtered = baseKeywords.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  return (
    <Box p={2}>
      {/* Autocomplete Search */}
      <Box mb={2} display="flex" gap={1} alignItems="center">
        <Autocomplete
          freeSolo
          options={filteredOptions}
          inputValue={searchText}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Keyword"
              size="small"
              variant="outlined"
              sx={{ borderRadius: 4, "& fieldset": { borderRadius: 3 } }}
            />
          )}
          sx={{ width: 400 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ borderRadius: 3, textTransform: "none" }}
        >
          Search
        </Button>
      </Box>

      {/* HTML Preview */}
      <Typography variant="h6" gutterBottom>
        HTML Preview
      </Typography>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          maxHeight: "60vh",
          overflowY: "auto",
          border: "1px solid #ccc",
        }}
        ref={contentRef}
      >
        <div
          dangerouslySetInnerHTML={{ __html: highlightedHTML }}
          style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}
        />
      </Paper>
    </Box>
  );
};

export default ShowHtml;
