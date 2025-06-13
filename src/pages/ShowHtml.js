import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const ShowHtml = () => {
  const [searchText, setSearchText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answerHTML, setAnswerHTML] = useState("<p>No data available</p>");

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoadingKeywords(true);
      try {
        const res = await axios.get("/recommendations");
        const suggestions = res.data?.recommended_questions || [];
        setKeywords(suggestions);
        setFilteredOptions(suggestions);
      } catch (err) {
        console.error("Error loading keywords", err);
      } finally {
        setLoadingKeywords(false);
      }
    };

    fetchKeywords();
  }, []);

  const handleSearch = async () => {
    if (!searchText?.trim()) return;

    setLoadingAnswer(true);
    try {
      const res = await axios.post("/ask_question", {
        question: searchText.trim(),
      });
      setAnswerHTML(res.data?.answer_html || "<p>No answer found.</p>");
    } catch (err) {
      console.error("Failed to fetch answer", err);
      setAnswerHTML("<p style='color: red;'>Failed to load answer.</p>");
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleInputChange = (event, value) => {
    setSearchText(value);
    const filtered = keywords.filter((option) =>
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
          loading={loadingKeywords}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ask a question or search"
              size="small"
              variant="outlined"
              sx={{ borderRadius: 4, "& fieldset": { borderRadius: 3 } }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingKeywords && (
                      <CircularProgress color="inherit" size={18} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{ width: 400 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            backgroundColor: "#6c5ce7",
          }}
        >
          Search
        </Button>
      </Box>

      {/* Answer Section */}
      <Typography variant="h6" gutterBottom>
        Answer from Document
      </Typography>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          height: "68vh",
          overflowY: "auto",
          border: "1px solid #ccc",
        }}
      >
        {loadingAnswer ? (
          <Typography variant="body2" color="textSecondary">
            Loading answer...
          </Typography>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: answerHTML }}
            style={{ fontFamily: "Georgia, serif", lineHeight: "1.6" }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default ShowHtml;
