import React, { useState } from 'react';
import jsondata from '../Data.json';
import ITComponent from '../IT-Component/ITComponent';
import WorkInProgress from '../work-in-progress/WorkInProgress';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import './AssessmentCreator.css';
import { BorderClear, Iso, WidthFull } from '@mui/icons-material';
import FormHelperText from '@mui/material/FormHelperText';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';

export default function AssessmentCreator() {
  const navigate = useNavigate();

  // State and other variables initialization
  const [showSectorMessage, setShowSectorMessage] = useState(true);

  const domainOptions = jsondata['Domain'].map(obj => obj.name);
  const [assessmentName, setAssessmentName] = useState('');
  const [assessmentNameError, setAssessmentNameError] = useState('');
  const [sector, setSector] = useState('');
  const [isIt, setIsIt] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [subDomains, setSubDomains] = useState([]);
  const assessmentNameRegex = /^[a-zA-Z][a-zA-Z_ ]*$/;
  const welcomeText = "Hello, I'm your Assessment Creator. A dedicated agent poised to assist you in crafting assessments effortlessly.";
  const [isFieldsFrozen, setIsFieldsFrozen] = useState(false);
  const backToHome = () => {
    navigate('/');
  };

  // Validate assessment name
  const validateAssessmentName = name => {
    if (!name.trim()) {
      setAssessmentNameError('Assessment name is required.');
      return false; // Return false if validation fails
    }
    if (!assessmentNameRegex.test(name)) {
      setAssessmentNameError('Please enter a proper assessment name');
      return false; // Return false if validation fails
    }
    setAssessmentNameError(''); // Clear error message if validation passes
    return true; // Return true if validation passes
  };

  // Event handlers
  const handleAssessmentNameChange = event => {
    const { value } = event.target;
    setAssessmentName(value); // Update assessment name
    validateAssessmentName(value); // Validate updated assessment name
    updateFieldFreeze(event.target.value, sector);
  };

  const handleDomainChange = event => {
    if (!validateAssessmentName(assessmentName)) {
      return;
    }
    const selectedDomainName = event.target.value;
    setSector(selectedDomainName); // Update sector

    // Set sub-domains and determine component visibility based on selected domain
    if (selectedDomainName) {
      setShowSectorMessage(false); // Hide message when a sector is selected
      const selectedDomain = jsondata['Domain'].find(domain => domain.name === selectedDomainName);
      setSubDomains(selectedDomain ? selectedDomain.subDomains || [] : []);
      setIsIt(selectedDomainName === 'IT');
      setIsOther(selectedDomainName !== 'IT');
      if (selectedDomainName === 'IT') {
        updateFieldFreeze(assessmentName, event.target.value);
      }
    } else {
      setShowSectorMessage(true); // Show message when no sector is selected
      setIsIt(false);
      setIsOther(false);
      setSubDomains([]);
    }
  };

  const updateFieldFreeze = (selectedName, selectedIndustry) => {
    // Freeze fields if both language and concept are selected
    setIsFieldsFrozen(selectedName !== '' && selectedIndustry !== '');
  };

  function FreezeHandlerFunction() {
    //console.log('Hi');
    setIsFieldsFrozen(false);
    setShowSectorMessage(true);
    setIsIt(false);
  }

  // Component render
  return (
    <div className="assessmentCreatorBody">
      <div className="heading">
        <div className="quick-header">
          <button className="back-button" onClick={backToHome}>
            <ArrowBackIosNewIcon style={{ color: 'white' }} />
          </button>
          <div className="title-container">
            <h3>Assessment Creator</h3>
          </div>
        </div>
      </div>

      <div className="top">
        <div className="first">
          <div className="Text">
            <FormControl fullWidth error={assessmentNameError}>
              <TextField
                fullWidth
                error={assessmentNameError}
                id="outlined-basic"
                className="textinput"
                type="text"
                name="assessmentName"
                placeholder="Enter Assessment Name"
                label="Assessment name*"
                disabled={isFieldsFrozen}
                value={assessmentName}
                onChange={handleAssessmentNameChange}
                // helperText="Assessment name is required"
                sx={{ height: '44px', '.MuiInputBase-input': { width: '100%', height: '30px' } }} // Adjusting input height accordingly
              />
              {assessmentNameError ? <FormHelperText id="component-error-text">Assessment name is required</FormHelperText> : <></>}
            </FormControl>
          </div>
          <div className="Text">
            {/* <label>Industry</label> */}
            <FormControl
              fullWidth
              sx={{
                '.MuiOutlinedInput-input': { height: '20px' },
                '.MuiSelect-select': { height: '45px', display: 'flex', alignItems: 'center' },
              }}
            >
              <InputLabel id="pl">Select Industry</InputLabel>

              <Select
                fullWidth
                name="sector"
                label="Select Industry"
                value={sector}
                disabled={isFieldsFrozen}
                onChange={handleDomainChange}
                sx={{ height: '50px', '.MuiOutlinedInput-input': { height: '30px' } }} // Adjust the height here
                MenuProps={{
                  MenuListProps: {
                    style: {
                      color: 'rgb(97,97,97)', // Change text color
                      fontFamily: 'Roboto, sans-serif', // Change font family
                    },
                  },
                }}
              >
                <MenuItem value="Select Industry">
                  <em>Select Industry</em>
                </MenuItem>
                {domainOptions.map((domain, index) => (
                  <MenuItem key={index} value={domain}>
                    {domain}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      {showSectorMessage ? <div className="fade-in-message">{welcomeText}</div> : null}
      {isIt && sector ? <ITComponent assessmentName={assessmentName} FreezeHandler={FreezeHandlerFunction} /> : null}
      {isOther && sector ? <WorkInProgress /> : null}
    </div>
  );
}
