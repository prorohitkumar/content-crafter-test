import React, { useState, useEffect, useRef } from 'react';
import './Chips.css';
import { TextField } from '@mui/material';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import InputAdornment from '@mui/material/InputAdornment';

function Chips({ onTagsChange, initialTags = [], suggestions = [], placeHolder, isRestClicked }) {
  const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      top: 'calc(-2vh + 15px)',
      fontSize: '13px',
      backgroundColor: '#007BFF;',
      // marginTop:'20px'
      // Adjust background color as needed
    },
  }));
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(true);
  const tagInputRef = useRef(null);
  useEffect(() => {
    setTags([]);
  }, [isRestClicked]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (tagInputRef.current && !tagInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseDown = () => {
    // Hide the tooltip when the field is clicked
    document.querySelector('.MuiTooltip-popper').style.visibility = 'hidden';
  };

  const handleInputFocus = () => {
    setFilteredSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const updateTags = newTags => {
    setTags(newTags);
    onTagsChange(newTags); // This should be a callback to inform the parent component
  };

  const addTag = value => {
    // Split the value by comma and trim each tag, filtering out only non-empty tags
    const tagList = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    if (tagList.length > 0) {
      // Combine with current tags and remove duplicates
      const newTags = Array.from(new Set([...tags, ...tagList]));
      updateTags(newTags);
      console.log(newTags);
    }
    setInput(''); // Clear input field
    setFilteredSuggestions([]); // Clear suggestions
  };

  const handleInputChange = e => {
    const userInput = e.target.value;
    setInput(userInput);

    // If user input includes a comma, add the tag(s)
    if (userInput.includes(',')) {
      addTag(userInput);
    } else {
      // Otherwise, filter suggestions based on the current input
      const filtered = suggestions.filter(suggestion => suggestion.toLowerCase().startsWith(userInput.toLowerCase()));
      setFilteredSuggestions(filtered);
    }
  };

  const handleInputKeyDown = e => {
    if ((e.key === 'Enter' || e.key === ',') && input) {
      e.preventDefault(); // Prevent form submission and default comma handling
      addTag(input);
    }
  };

  const removeTag = indexToRemove => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    updateTags(newTags);
  };

  const handleSuggestionClick = suggestion => {
    console.log(suggestion);
    addTag(suggestion);
  };

  return (
    <div className="tags-input-container" ref={tagInputRef}>
      <div className="tag-items">
        {tags.map((tag, index) => (
          <div key={index} className="tag-item">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="tag-remove-button">
              &times;
            </button>
          </div>
        ))}
      </div>

      <input
        fullWidth
        startAdornment={
          <InputAdornment position="start">
            <StyledTooltip title="Information about the domain">
              <InfoIcon />
            </StyledTooltip>
          </InputAdornment>
        }
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeHolder + ' ( Type and hit enter or comma to add ) *'}
        className="tag-input"
        onFocus={handleInputFocus}
        style={{
          paddingLeft: '3px',
          paddingBottom: '0px', // Adjust the padding bottom as needed
          verticalAlign: 'bottom',
          fontWeight: '400',
          fontSize: '1rem',
          height: '8rem',
        }}
        // onMouseDown={handleMouseDown}

        // Add this
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="suggestions-container">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-tag" // Add this
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Chips;
