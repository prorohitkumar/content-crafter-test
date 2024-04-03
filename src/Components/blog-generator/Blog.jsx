import React, { useState } from 'react';
import axios from 'axios';
import './Blog.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Spinner from '../Spinner';
import { useNavigate } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChipInput from 'material-ui-chip-input';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function App() {
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState('750');
  const [audienceLevel, setAudienceLevel] = useState('Beginner');
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const welcomeText = "Hello! I'm BlogCrafter, crafting captivating content to elevate your online presence.";
  const [keywords, setKeywords] = useState([]);
  const [isCopyIconChanged, setIsCopyIconChanged] = useState(false); // Add this state

  const level = [
    {
      value: 'Beginner',
      label: 'Beginner'
    },
    {
      value: 'Intermediate',
      label: 'Intermediate'
    },
    {
      value: 'Advance',
      label: 'Advance'
    },
  ];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate title and number fields
    if (!title.trim()) {
      setError('Please add a blog post title.');
      return;
    }

    // Validate title length
    if (title.length > 75) {
      setError('Title should not exceed 75 characters.');
      return;
    }

    // Validate word count
    const count = parseInt(wordCount);
    if (isNaN(count) || count < 0) {
      setError('Please enter a valid non-negative number for word count.');
      return;
    }
    if (count > 2000) {
      setError('Word count should not exceed 2000.');
      return;
    }

    const formData = new FormData();
    formData.append('input_text', title);
    formData.append('no_words', wordCount);
    formData.append('blog_style', audienceLevel);
    formData.append('keywords', keywords.join(',')); // Join keywords with comma
    setIsLoading(true);
    setIsClick(true);

    try {
      const response = await axios.post('http://localhost:5001/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponse(response.data);
      console.log(response)
      setError('');

      // Copy response text to clipboard
      navigator.clipboard.writeText(response.data);
      setIsCopyIconChanged(true); // Set state to indicate that the icon has been changed
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Invalid request. Please check your input.');
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setTitle('');
    setWordCount('750');
    setAudienceLevel('Beginner');
    setKeywords([]);
    setError('');
    setResponse('');
    setIsClick(false);
    setIsLoading(false);
    setIsCopyIconChanged(false); // Reset copy icon state
  };

  const handleAddChip = (chip) => {
    if (keywords.length < 5) {
      setKeywords([...keywords, chip]);
    } else {
      // Notify user if they try to add more than 5 keywords
      setError('You can only add up to 5 keywords.');
    }
  };

  const handleDeleteChip = (chip, index) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  return (
    <div className="blog-container">
      <div className="header1">
        <div className='title-container'>
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowBackIosNewIcon />
          </button>
          <h1>BlogCrafter</h1>
        </div>
        {response && (
          <Tooltip title="Click to copy text" arrow >
            <Button
              className="copy-button"
              variant="contained"
              onClick={() => {
                navigator.clipboard.writeText(response);
                setIsCopyIconChanged(true);
              }}
              style={{ backgroundColor: 'green', height: '40px', marginLeft: '5%' }}
            >
              {isCopyIconChanged ? <FileCopyIcon /> : <CheckCircleIcon />}
            </Button>
          </Tooltip>
        )}
      </div>
      <div className='blog-card-containers'>

        <div className='blog-card'>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <label>
                <div style={{ color:'black'}}>Create a blog post titled</div>
                <Tooltip title="Enter the title of your blog" arrow >
                  <TextField
                    id="standard-basic"
                    label="Blog Title*"
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Tooltip>
                <div style={{ color:'black'}}>with these</div>
                <ChipInput
                  value={keywords}
                  onAdd={(chip) => handleAddChip(chip)}
                  onDelete={(chip, index) => handleDeleteChip(chip, index)}
                  style={{ width: "57vh", marginLeft: "10px" }}
                  chipProps={{ style: { backgroundColor: 'blue', color: 'blue' } }}
                />
                <div style={{ marginTop: '30px' ,color:'black'}}>  keywords. It should be around </div>
                <Tooltip title="Enter the word count for your blog (up to 2000)" arrow>
                  <TextField
                    id="outlined-number"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    value={wordCount}
                    inputProps={{ min: 1, max: 2000 }}
                    onChange={(e) => setWordCount(e.target.value)}
                    variant="standard"
                  />
                </Tooltip>
                <div style={{ color:'black'}}>words and for</div>
                <Tooltip title="Select the audience level for your blog" arrow>
                  <TextField
                    id="standard-select-level"
                    select
                    label="Select"
                    value={audienceLevel}
                    onChange={(e) => setAudienceLevel(e.target.value)}
                    variant="standard"
                    style={{ marginLeft: "-3px" }}
                  >
                    {level.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
                <div style={{ color:'black'}}> level audience.</div>
              </label>
            </form>
          </div>
          <div>
          </div>
          <div className='btt-err-container'>
            <div className='error-cont'>
              {error && <p className="error" style={{}}>{error}</p>}
            </div>

            <div className="buttons-container">

              <Tooltip title="Click to reset" arrow>
                <Button
                  className="refresh-button"
                  variant="contained"
                  onClick={handleRefresh}
                  style={{ backgroundColor: 'red', height: '40px', marginTop: '1%', marginRight: '5%' }}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Click to generate text" arrow>
                <Button
                  className="generate-button"
                  variant="contained"
                  onClick={handleSubmit}
                  style={{ height: '40px', marginTop: '1%' }}
                >
                  <SendIcon style={{ transform: 'rotate(-30deg)', paddingBottom: '10%' }} />
                </Button>
              </Tooltip>

            </div>
          </div>
        </div>
        <div className="blog-response" style={{ maxWidth: '100%' }}>
          {isClick && isLoading && (
            <div className="spinner-container" >
              <Spinner />
            </div>
          )}
          {isClick && !isLoading && (
            <MarkdownPreview className="response-content" source={response} />
          )}
          {!isClick && <div className="welcome">{welcomeText}</div>}

        </div>
      </div>
    </div>
  );
}

export default App;
