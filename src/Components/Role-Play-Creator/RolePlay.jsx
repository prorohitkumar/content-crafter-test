import React, { useState, useEffect, useCallback, useRef } from 'react';
import './RolePlay.css';
import jsondata from '../Data.json';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chips from './Chips';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import MultipleChipsInput from './tags';
import Button from '@mui/material/Button';
import Spinner from '../Spinner';
import MarkdownPreview from '@uiw/react-markdown-preview';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import FormHelperText from '@mui/material/FormHelperText';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const RolePlay = () => {
  const navigate = useNavigate();

  const renderLabelWithIcon = (labelText, tooltipText) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {labelText}
      <StyledTooltip title={tooltipText}>
        <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
      </StyledTooltip>
    </Box>
  );
  const StyledTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      top: 'calc(-2vh + 10px)',
      fontSize: '13px',
      backgroundColor: '#007BFF;',
      // marginTop:'20px'
      // Adjust background color as needed
    },
  }));

  const handleMouseDown = () => {
    // Hide the tooltip when the field is clicked
    document.querySelector('.MuiTooltip-popper').style.visibility = 'hidden';
  };
  const domainOptions = jsondata['Domain'].map(obj => obj.name);
  const [domain, setDomain] = useState('');
  const [isOther, setIsOther] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [complexity, setComplexity] = useState('');
  const [experience, setExperience] = useState('');

  const [industryContext, setIndustryContext] = useState('');
  const [scenarioSettings, setScenarioSettings] = useState('');
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [result, setResult] = useState('');

  const handleRolesChange = newRoles => {
    // alert('hiio');
    setRoles(newRoles);
    setRolesError(false);
    // if (!isRolesValid) {
    //   isRolesValidUpdate();
    //   isRolesValidUpdate();
    // }

    // console.log(roles)
  };

  const handleSkillsChange = newSkills => {
    setSkills(newSkills);
    setSkillsError(false);
    // if (!isSkillsValid) {
    //   isSkillsValidUpdate();
    //   isSkillsValidUpdate();
    // }
  };

  const handleIndustryContextChange = event => {
    setIndustryContext(event.target.value);
  };

  const handleScenarioSettingsChange = event => {
    setScenarioSettings(event.target.value);
  };

  const handleComplexityChange = event => {
    setComplexity(event.target.value);
  };

  const handleExperienceChange = event => {
    setExperience(event.target.value);
  };

  const handleDomainChange = event => {
    // if (!validateAssessmentName(assessmentName)) {
    //   return;
    // }y
    // alert(domain);
    const selectedDomainName = event.target.value;
    if (selectedDomainName === 'Others') {
      setIsOther(true);
    } else {
      setIsOther(false);
    }
    setDomain(selectedDomainName); // Update sector
    setIsDomainValid(true);
    // alert(domain);

    // if (!isDomainValid) {
    //   isDomainValidUpdate();
    // } // Set sub-domains and determine component visibility based on selected domain
  };

  const learningObjectiveChange = event => {
    // if (!validateAssessmentName(assessmentName)) {
    //   return;
    // }
    const learningObjective = event.target.value;
    // setDomain(selectedDomainName); // Update sector
    setLearningObjective(learningObjective);
    setIsLearningObjectValid(true);
    // isLOValidUpdate();

    // Set sub-domains and determine component visibility based on selected domain
  };

  const OtherIndustyChange = event => {
    const othersIndustry = event.target.value;
    setOtherIndustry(othersIndustry);
    setIsLearningObjectValid(true);
    setOtherError(false);
    setIsOtherValid(true);
    // isLOValidUpdate();

    // Set sub-domains and determine component visibility based on selected domain
  };
  // error handling

  // State variables for validation errors
  const [domainError, setDomainError] = useState('');
  const [isDomainValid, setIsDomainValid] = useState(true);
  const [learningObjectiveError, setLearningObjectiveError] = useState('');
  const [isLearningObjectiveValid, setIsLearningObjectValid] = useState(true);
  const [rolesError, setRolesError] = useState('');
  const [isRolesValid, setIsRolesValid] = useState(true);

  const [skillsError, setSkillsError] = useState('');
  const [isSkillsValid, setIsSkillsValid] = useState(true);
  const [isOtherValid, setIsOtherValid] = useState(true);
  const [otherError, setOtherError] = useState(true);

  const isDomainValidUpdate = async () => {
    const r = validateDomain();
    setIsDomainValid(r);
  };

  const isLOValidUpdate = async () => {
    const r = validateLearningObjective();
    setIsLearningObjectValid(r);
  };
  const isRolesValidUpdate = async () => {
    const r = validateRoles();
    setIsRolesValid(r);
    const rr = validateRoles();
    setIsRolesValid(rr);
  };

  const isSkillsValidUpdate = async () => {
    const r = validateSkills();
    setIsSkillsValid(r);
    const rr = validateSkills();
    setIsSkillsValid(rr);
  };

  const validateDomain = () => {
    if (!domain.trim()) {
      setDomainError('Please select industry');
      setIsDomainValid(false);
      return false;
    }
    setDomainError('');
    setIsDomainValid(true);
    // alert(domain);

    return true;
  };

  const validateOther = () => {
    if (!otherIndustry.trim()) {
      setOtherError('Pleas add other industry');
      setIsOtherValid(false);
      return false;
    }
    setOtherError('');
    setIsOtherValid(true);
    // alert(domain);

    return true;
  };

  // Validation function for learning objective
  const validateLearningObjective = () => {
    if (!learningObjective.trim()) {
      setLearningObjectiveError('Please add learning objective');
      setIsLearningObjectValid(false);
      return false;
    }
    setLearningObjectiveError('');
    setIsLearningObjectValid(true);

    return true;
  };

  // Validation function for roles
  const validateRoles = () => {
    if (roles.length === 0) {
      setRolesError('Please add at least 1 role');
      setIsRolesValid(false);
      return false;
    }
    setRolesError('');
    setIsRolesValid(true);

    return true;
  };

  // Validation function for skills
  const validateSkills = () => {
    if (skills.length === 0) {
      setSkillsError('Please add at least 1 skill');
      setIsSkillsValid(false);
      return false;
    }
    setSkillsError('');
    setIsSkillsValid(true);

    return true;
  };

  //  back to home
  const backToHome = () => {
    navigate('/');
  };

  const [isRedirect, setIsRedirect] = useState(false);
  const [isAnsReady, setIsAnsReady] = useState(false);
  const responseContainerRef = useRef(null); // Initialize the ref here

  useEffect(() => {
    if (isAnsReady) {
      responseContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isAnsReady]);

  const handleSubmit = async () => {
    // Perform validation
    const isDomainValid = validateDomain();
    const isLearningObjectiveValid = validateLearningObjective();
    const isRolesValid = validateRoles();
    const isSkillsValid = validateSkills();
    var isOtherEntryvalid = true;
    if (isOther) {
      isOtherEntryvalid = validateOther();
    }

    // If any field is invalid, stop submission
    if (!isDomainValid || !isLearningObjectiveValid || !isRolesValid || !isSkillsValid || !isOtherEntryvalid) {
      return;
    }
    var industry;

    if (isOther) {
      industry = otherIndustry;
    } else {
      industry = domain;
    }

    const formData = {
      industry,
      learningObjective,
      complexity,
      experience,
      industryContext,
      scenarioSettings,
      roles,
      skills,
    };

    // console.log(formData);

    try {
      setIsRedirect(true);
      setIsAnsReady(false);
      const response = await fetch('http://127.0.0.1:5000/role_play_creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      setIsRedirect(false);
      setIsAnsReady(true);

      if (!response.ok) {
        toast.error('Oh no, something went wrong!');

        setIsRedirect(false);
        setIsAnsReady(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      //   console.log(result[0]);
      setResult(result[0]);
      // Handle success response
    } catch (error) {
      toast.error('Oh no, something went wrong!');

      //   console.error('Error:', error);
      setIsRedirect(false);
      setIsAnsReady(false);
      // Handle errors here
    }
  };
  const [isRestClicked, setIsResetClicked] = useState(false);

  const handleReset = () => {
    setIsResetClicked(!isRestClicked);
    setDomain('');
    setLearningObjective('');
    setComplexity('');
    setExperience('');
    setIndustryContext('');
    setScenarioSettings('');
    setRoles([]);
    setSkills([]);
    setResult('');
    setIsDomainValid(true);
    setDomainError('');
    setIsLearningObjectValid(true);
    setLearningObjectiveError('');
    setIsRolesValid(true);
    setRolesError('');
    setIsSkillsValid(true);
    setSkillsError('');
    setIsRedirect(false);
    setIsAnsReady(false);
    setIsOther(false);
    setOtherIndustry('');

    // setIsResetClicked(false);
  };

  const Download = () => {
    const blob = new Blob([result], { type: 'text/markdown' });
    const anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = `role-play.md`;
    anchor.click();
  };

  // downloading docs  file
  const handleDownload = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/download-docx',
        {
          markdown_content: result,
        },
        { responseType: 'blob' },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'role_play_exercise.docx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error('Oh no, something went wrong!');

      // console.error('Error downloading document:', error);
    }
  };

  // Convert document to buffer
  //   const buffer = await Packer.toBuffer(doc);

  //   // Convert buffer to blob
  //   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

  //   // Save blob as a .docx file
  //   saveAs(blob, 'my_document.docx');

  //   // const packer = new Packer();
  //   // packer.toBlob(doc)
  //   // const blob = await packer.toBlob(doc);
  //   // saveAs(blob, 'my_document.docx');
  // };

  return (
    <div className="RolePlayBody">
      <div className="heading">
        <div className="headerr">
          <button className="back-button" onClick={backToHome}>
            <ArrowBackIosNewIcon style={{ color: 'white' }} />
          </button>
          <div className="title-container">
            <h3>Role-Play Creator</h3>
          </div>
        </div>
      </div>
      <div className="inputArea">
        <div className="input1">
          <div className="rolePlay-domain">
            <FormControl
              fullWidth
              sx={{
                '.MuiOutlinedInput-input': { height: '20px' },
                '.MuiSelect-select': { height: '45px', display: 'flex', alignItems: 'center' },
              }}
              error={!isDomainValid}
            >
              <InputLabel id="pl">
                Select industry <span style={{ color: '' }}>*</span>
              </InputLabel>

              <Select
                required
                fullWidth
                name="domain"
                label="Select industry *"
                value={domain}
                onChange={handleDomainChange}
                sx={{ height: '45px', '.MuiOutlinedInput-input': { height: '30px' } }} // Adjust the height here
                MenuProps={{
                  MenuListProps: {
                    style: {
                      color: 'rgb(97,97,97)', // Change text color
                      fontFamily: 'Roboto, sans-serif', // Change font family
                    },
                  },
                }}
              >
                <MenuItem value="Select Domain">
                  <em>Select industry</em>
                </MenuItem>
                {domainOptions.map((domain, index) => (
                  <MenuItem key={index} value={domain}>
                    {domain}
                  </MenuItem>
                ))}
              </Select>
              {!isDomainValid ? (
                <FormHelperText id="component-error-text" sx={{ marginTop: '1px', fontSize: 'md', textDecoration: 'bold' }}>
                  {domainError}
                </FormHelperText>
              ) : (
                <></>
              )}
            </FormControl>
            {isOther ? (
              <FormControl style={{ marginLeft: '10px' }} fullWidth error={!isOtherValid}>
                <TextField
                  error={!isOtherValid}
                  fullWidth
                  id="outlined-basic"
                  className="textinput"
                  type="text"
                  name="assessmentName"
                  placeholder="Enter other industry"
                  label={
                    <>
                      Add other industry <span style={{ color: '' }}>*</span>
                    </>
                  }
                  value={otherIndustry}
                  onChange={OtherIndustyChange}
                  // helperText="Assessment name is required"
                  sx={{ height: '44px', '.MuiInputBase-input': { width: '100%', height: '25px' } }} // Adjusting input height accordingly
                />
                {!isOtherValid ? (
                  <FormHelperText id="component-error-text" sx={{ marginTop: '2px', fontSize: 'md', textDecoration: 'bold' }}>
                    {otherError}
                  </FormHelperText>
                ) : (
                  <></>
                )}
              </FormControl>
            ) : (
              <></>
            )}
          </div>

          <div className="input1">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StyledTooltip
                title="Ex: identifying and managing risks in IT projects, integrating ethical considerations in AI development, developing and implementing a cloud migration strategy, optimizing the Agile software development process, managing a cybersecurity incident effectively"
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth error={!isLearningObjectiveValid}>
                {/* <InputLabel id="pl">
                  Add learning objective <span style={{ color: '' }}>*</span>
                </InputLabel> */}
                <TextField
                  error={!isLearningObjectiveValid}
                  labelId="pl"
                  fullWidth
                  id="outlined-basic"
                  className="textinput"
                  type="text"
                  name="assessmentName"
                  placeholder="Add learning objective"
                  label={
                    <>
                      Add learning objective <span style={{ color: '' }}>*</span>
                    </>
                  }
                  value={learningObjective}
                  onChange={learningObjectiveChange}
                  // helperText="Assessment name is required"
                  sx={{ height: '44px', '.MuiInputBase-input': { width: '100%', height: '25px' } }} // Adjusting input height accordingly
                />
                {!isLearningObjectiveValid ? (
                  <FormHelperText id="component-error-text" sx={{ marginTop: '2px', fontSize: 'md', textDecoration: 'bold' }}>
                    {learningObjectiveError}
                  </FormHelperText>
                ) : (
                  <></>
                )}
              </FormControl>
            </Box>
          </div>

          <div className="input1">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} error={isRolesValid}>
              <StyledTooltip
                title="Specific roles to be played in this exercise, Ex: Tech Lead, Security Analyst, Full Stack Developer, Devops Engineer"
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth style={{ marginTop: '10px' }}>
                <Chips
                  placeHolder={'Add roles to be played in this exercise '}
                  // onMouseDown={handleMouseDown}
                  initialTags={roles}
                  suggestions={[]}
                  isRestClicked={isRestClicked}
                  // onTagsChange={handleRolesChange}
                  // onTagsChange={newTags => handleRolesChange( newTags)}
                  onTagsChange={newTags => handleRolesChange(newTags)}
                />
                {!isRolesValid ? (
                  <FormHelperText id="component-error-text" sx={{ marginTop: '1px', color: 'red', fontSize: 'md', textDecoration: 'bold' }}>
                    {rolesError}
                  </FormHelperText>
                ) : (
                  <></>
                )}
              </FormControl>
            </Box>
          </div>

          <div className="input1">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} error={isSkillsValid}>
              <StyledTooltip
                title="Skills that participants should gain post completing this exercise, Ex: incident response,backlog prioritization, UI responsiveness"
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth style={{ marginTop: '10px' }}>
                <Chips
                  placeHolder={'Add skills to gain post completing this exercise '}
                  // onMouseDown={handleMouseDown}
                  initialTags={skills}
                  suggestions={[]}
                  isRestClicked={isRestClicked}
                  onTagsChange={newTags => handleSkillsChange(newTags)}
                />
                {!isSkillsValid ? (
                  <FormHelperText id="component-error-text" sx={{ marginTop: '1px', color: 'red', fontSize: 'md', textDecoration: 'bold' }}>
                    {skillsError}
                  </FormHelperText>
                ) : (
                  <></>
                )}
              </FormControl>
            </Box>
          </div>

          <div className="inputt">
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 0 }}>
              <FormControl
                fullWidth
                sx={{
                  '.MuiOutlinedInput-input': { height: '20px' },
                  '.MuiSelect-select': { height: '45px', display: 'flex', alignItems: 'center' },
                }}
              >
                <InputLabel id="complexity-select-label">Select complexity</InputLabel>
                <Select
                  labelId="complexity-select-labell"
                  id="complexity-select"
                  value={complexity}
                  label="Select complexity"
                  sx={{ height: '45px', '.MuiOutlinedInput-input': { height: '30px' } }} // Adjust the height here
                  MenuProps={{
                    MenuListProps: {
                      style: {
                        color: 'rgb(97,97,97)', // Change text color
                        fontFamily: 'Roboto, sans-serif', // Change font family
                      },
                    },
                  }}
                  onChange={handleComplexityChange}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="experience-select-label"> Select participants years of experience</InputLabel>
                <Select
                  labelId="experience-select-label"
                  id="experience-select"
                  value={experience}
                  label="Select participants years of experience"
                  sx={{ height: '45px', '.MuiOutlinedInput-input': { height: '30px' } }} // Adjust the height here
                  MenuProps={{
                    MenuListProps: {
                      style: {
                        color: 'rgb(97,97,97)', // Change text color
                        fontFamily: 'Roboto, sans-serif', // Change font family
                      },
                    },
                  }}
                  onChange={handleExperienceChange}
                >
                  <MenuItem value="0-3">0-3 </MenuItem>
                  <MenuItem value="3-5">3-5 </MenuItem>
                  <MenuItem value="5-10">5-10 </MenuItem>
                  <MenuItem value="5-10">10-15 </MenuItem>
                  <MenuItem value="15+">15+ </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          <div className="input">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StyledTooltip
                title="Ex: A company developing AI-driven products, an IT project facing multiple potential risks, an organization migrating to cloud "
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Add industry context"
                  margin="normal"
                  value={industryContext}
                  onChange={handleIndustryContextChange}
                  sx={{ height: '44px', '.MuiInputBase-input': { width: '100%', height: '25px' } }} // Adjusting input height accordingly
                />
              </FormControl>
            </Box>
          </div>
          <div className="input">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StyledTooltip
                title="Specific time, location, and circumstances within which the role-playing exercise unfolds"
                placement="top"
                arrow
              >
                <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
              </StyledTooltip>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  label="Add scenario settings"
                  margin="normal"
                  value={scenarioSettings}
                  onChange={handleScenarioSettingsChange}
                  sx={{ height: '44px', '.MuiInputBase-input': { width: '100%', height: '25px' } }} // Adjusting input height accordingly
                />
              </FormControl>
            </Box>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button
            variant="contained"
            onClick={handleReset}
            // disabled={!isResetEnabled}
            style={{ maxWidth: '10px', marginRight: '10px' }}
          >
            <RefreshIcon />
          </Button>
          <Button
            type="button"
            // style={{ backgroundColor: 'green' }}
            variant="contained"
            color="primary"
            onClick={handleSubmit} // Attach the handleSubmit function here
          >
            Generate
          </Button>
          {isAnsReady ? (
            <StyledTooltip title="Download the response" arrow>
              <Button
                type="button"
                className="download-btn"
                onClick={handleDownload}
                style={{ backgroundColor: 'green', color: 'white', marginLeft: '4px' }}
              >
                <DownloadIcon />
              </Button>
            </StyledTooltip>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* <MultipleChipsInput /> */}
      {isRedirect & !isAnsReady ? (
        <>
          {/* <div className="assessment-spinner">
        <Spinner />
        </div> */}
          <div className="loading-dots">
            <Spinner />
            {/* <div className="dot"></div> */}
            {/* <div className="dot"></div> */}
            {/* <div className="dot"></div> */}
          </div>
        </>
      ) : (
        <>
          {' '}
          {isAnsReady ? (
            <div className="output" ref={responseContainerRef}>
              {/* <h2>Response Data</h2> */}
              <div className="response-containerr">
                {/* <button onClick={downloadExcel}>Download</button> */}
                <MarkdownPreview source={result} />
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default RolePlay;
