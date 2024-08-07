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
import RefreshIcon from '@mui/icons-material/Refresh';
import ChipInput from 'material-ui-chip-input';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';

const LevelOptions = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advance', label: 'Advance' },
];

const App = () => {
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState('500');
  const [audienceLevel, setAudienceLevel] = useState('Beginner');
  const [error, setError] = useState('');
  const [response, setResponse] = useState('');
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [isCopyIconChanged, setIsCopyIconChanged] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please add a blog post title.');
      return;
    }
    if (title.length > 75) {
      setError('Title should not exceed 75 characters.');
      return;
    }
    const count = parseInt(wordCount);
    if (isNaN(count) || count < 0) {
      setError('Please enter a valid non-negative number for word count.');
      return;
    }
    if (isNaN(count) || count < 10) {
      setError('Words should not be less than 10');
      return;
    }
    if (count > 750) {
      setError('Word count should not exceed 750.');
      return;
    }

    const formData = new FormData();
    formData.append('input_text', title);
    formData.append('no_words', wordCount);
    formData.append('blog_style', audienceLevel);
    formData.append('keywords', keywords.join(','));
    setIsLoading(true);
    setIsClick(true);

    try {
      const response = await axios.post('https://contentcrafter-python-blog-1.onrender.com/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(response.data);
      setError('');
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
    setWordCount('500');
    setAudienceLevel('Beginner');
    setKeywords([]);
    setError('');
    setResponse('');
    setIsClick(false);
    setIsLoading(false);
    setIsCopyIconChanged(false);
  };

  const handleAddChip = chip => {
    const newChips = chip
      .split(',')
      .map(part => part.trim())
      .filter(part => part !== '');
    const remainingSpace = 5 - keywords.length;
    if (newChips.length > remainingSpace) {
      setError('You can only add up to 5 keywords.');
      return;
    }
    const chipsToAdd = newChips.slice(0, remainingSpace);
    setKeywords([...keywords, ...chipsToAdd]);
  };

  const handleDeleteChip = (chip, index) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setIsCopyIconChanged(true);
  };

  const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      top: '-2vh',
      fontSize: '13px',
      backgroundColor: '#007bff',
    },
  }));

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      const downloadFormData = new FormData();
      downloadFormData.append('markdown_content', response); // Send the markdown content to the backend
      const downloadResponse = await axios.post('https://flask-api-volj.onrender.com/download-docx', downloadFormData, {
        headers: {
          'Content-Type': 'application/json', // Specify content type
        },
        responseType: 'blob', // Specify the response type as blob
      });
      // Trigger the download of the generated .docx file
      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'blog.docx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      // Handle errors
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="blog-container">
      <div className="header1">
        <div className="title-container">
          <button className="back-button" onClick={() => navigate('/')} style={{ color: 'white' }}>
            <ArrowBackIosNewIcon />
          </button>
          <h1>Blogg Crafteer</h1>
        </div>
      </div>
      <div className="blog-card-containers">
        <div className="blog-card">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <label>
                <div style={{ color: 'black' }}>Create a blog post titled</div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '13px',

                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title="Enter the title of your blog"
                  arrow
                >
                  <TextField id="standard-basic" variant="standard" value={title} onChange={e => setTitle(e.target.value)} />
                </Tooltip>
                <div style={{ color: 'black', marginTop: '15px' }}>,</div>
                <div style={{ color: 'black', marginTop: '15px' }}>with these</div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '13px',

                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title="Enter keywords for your blog"
                  arrow
                >
                  <ChipInput
                    value={keywords}
                    onAdd={chip => handleAddChip(chip)}
                    onDelete={(chip, index) => handleDeleteChip(chip, index)}
                    style={{ width: '65vh', marginLeft: '10px' }}
                    chipProps={{ style: { backgroundColor: 'blue', color: 'blue' } }}
                    newChipKeys={[',']} // Adding comma as a new chip key
                  />{' '}
                </Tooltip>
                <div style={{ color: 'black', marginTop: '15px' }}> keywords. </div>
                <div style={{ color: 'black', marginTop: '15px' }}> It should be around </div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title="Enter the word count for your blog (10-750)"
                  arrow
                >
                  <TextField
                    id="outlined-number"
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    value={wordCount}
                    inputProps={{ min: 10, max: 750 }}
                    onChange={e => setWordCount(e.target.value)}
                    variant="standard"
                  />
                </Tooltip>
                <div style={{ color: 'black', marginTop: '15px' }}>words and for</div>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '13px',
                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title="Select the audience level"
                  arrow
                >
                  <TextField
                    id="standard-select-level"
                    select
                    value={audienceLevel}
                    onChange={e => setAudienceLevel(e.target.value)}
                    variant="standard"
                    style={{ marginLeft: '10px' }}
                  >
                    {LevelOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Tooltip>
                <div style={{ color: 'black', marginTop: '15px' }}> level audience.</div>
              </label>
            </form>
          </div>
          <div className="btt-err-container">
            <div className="error-cont">
              {error && (
                <p className="error" style={{}}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="blog-response" style={{ maxWidth: '100%' }}>
          <div className="iicons">
            {response && (
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title="Click to download in .docx format"
                arrow
              >
                <Button
                  // variant="contained"
                  color="primary"
                  disabled={isDownloading}
                  onClick={handleDownloadDocx}
                >
                  <DownloadIcon />
                </Button>
              </Tooltip>
            )}
            {response && (
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title="Click to copy text"
                arrow
              >
                <Button className="copy-button" onClick={handleCopyToClipboard} style={{ height: '30px' }}>
                  {isCopyIconChanged ? <CheckCircleIcon /> : <FileCopyIcon />}
                </Button>
              </Tooltip>
            )}
          </div>
          {isClick && isLoading && (
            <div className="spinner-container">
              <Spinner />
            </div>
          )}
          {isClick && !isLoading &&  <MarkdownPreview className="response-content" source={response} style={{ marginTop: '-6px' }} />}
          {!isClick && (
            <div className="welcome">
              Welcome to Blog Crafter, your virtual assistant in crafting compelling blog content to enhance your online visibility.
            </div>
          )}
        </div>
      </div>
      <div className="buttons-container">
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: '13px',
                bgcolor: '#007bff',
                '& .MuiTooltip-arrow': {
                  color: 'common.black',
                },
              },
            },
          }}
          title="Click to reset"
          arrow
        >
          <Button
            className="refresh-button"
            variant="contained"
            onClick={handleRefresh}
            style={{ backgroundColor: 'red', height: '40px', marginTop: '1%', marginRight: '2vh' }}
          >
            <RefreshIcon />
          </Button>
        </Tooltip>
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: '13px',
                bgcolor: '#007bff',
                '& .MuiTooltip-arrow': {
                  color: 'common.black',
                },
              },
            },
          }}
          title="Click to generate text"
          arrow
        >
          <Button
            className="generate-button"
            variant="contained"
            onClick={handleSubmit}
            // disabled={!!response}
            style={{ height: '40px', marginTop: '1%' }}
          >
            Generate
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default App;
