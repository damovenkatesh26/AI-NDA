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
import Popper from "@mui/material/Popper";
import VoiceInput from "../Components/VoiceText";

const ShowHtml = ({ pdfFile }) => {
  const [searchText, setSearchText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answerHTML, setAnswerHTML] = useState("<p>No data available</p>");

  useEffect(() => {
    setAnswerHTML("<p>No data available</p>");
    setSearchText("");
    fetchKeywords();
  }, [pdfFile]);

  const fetchKeywords = async () => {
    setLoadingKeywords(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASIC_URL}/recommendations`
      );
      const suggestions = res.data?.recommended_questions || [];
      setKeywords(suggestions);
      setFilteredOptions(suggestions);
    } catch (err) {
      console.error("Error loading keywords", err);
    } finally {
      setLoadingKeywords(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText?.trim()) return;
    setLoadingAnswer(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASIC_URL}/ask_question`,
        { question: searchText.trim() }
      );
      const htmlWithBreaks = res.data?.answer_html?.replace(/\n/g, "<br />");
      setAnswerHTML(htmlWithBreaks || "<p>No answer found.</p>");
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

  // Widen the autocomplete dropdown
  const CustomPopper = (props) => {
    return <Popper {...props} style={{ width: 600, zIndex: 1300 }} />;
  };

  return (
    <Box p={2}>
      {/* Autocomplete with Voice and Search */}
      <Box mb={2} display="flex" gap={1} alignItems="center">
        <Autocomplete
          freeSolo
          options={filteredOptions}
          inputValue={searchText}
          onInputChange={handleInputChange}
          loading={loadingKeywords}
          PopperComponent={CustomPopper}
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
          sx={{ width: 600 }}
        />
        <VoiceInput setSearchText={setSearchText} />
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

      {/* Answer Output */}
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
