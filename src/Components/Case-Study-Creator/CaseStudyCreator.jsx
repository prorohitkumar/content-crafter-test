import React, { useRef, useState } from 'react';
import './CaseStudyCreator.css';
import Spinner from '../Spinner';
import TagInput from '../IT-Component/TagInput';
import ITdata from '../IT.json';
import CaseStudyResponse from '../CaseStudyResponse/CaseStudyResponse';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  MenuItem,
  Select,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
} from '@mui/material';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const ITsector = ITdata.Sectors[0];

const CaseStudyCreator = () => {
  // State for each form field
  const [trainingProgramType, settrainingProgramType] = useState('');
  const [vertical, setvertical] = useState('');
  const [otherVertical, setOtherVertical] = useState('');
  const [learningObjectives, setlearningObjectives] = useState([]);
  const [objective, setobjective] = useState('');
  const [technologies, settechnologies] = useState([]);
  const [duration, setDuration] = useState('');
  const [numberOfDevelopers, setNumberOfDevelopers] = useState('');
  const [difficulty, setdifficulty] = useState('');
  const [scenarioDescription, setscenarioDescription] = useState('');
  const [specialization, setspecialization] = useState('');
  const [otherspecialization, setotherspecialization] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const assessmentNameRegex = /^[a-zA-Z][a-zA-Z_ ]*$/;

  const [verticalError, setverticalError] = useState('');
  const [otherverticalError, setotherverticalError] = useState('');
  const [specializationError, setspecializationError] = useState('');
  const [otherspecializationError, setotherspecializationError] = useState('');
  const [caseStudyNameError, setCaseStudyNameError] = useState('');
  const [scDescError, setscDescError] = useState('');
  const [learningObjectiveError, setlearningObjectiveError] = useState('');
  const [technologiesError, setTechnologiesError] = useState('');
  const [difficultyError, setdifficultyError] = useState('');
  const [durationError, setdurationError] = useState('');
  const [numOfDevsError, setnumOfDevsError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  
  const myRef = useRef(null);

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      top: 'calc(-2vh + 10px)',
      fontSize: '13px',
      backgroundColor: '#007bff;',
      // Adjust background color as needed
    },
  }));

  // Options for the dropdowns, ideally these would come from a database or API
  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const specializationOptions = ITsector.Specializations;
  const toolsTechnologies =
    ITdata.Sectors[0].ToolsTechnologiesPlatformsFrameworks;

  const formData = {
    vertical: vertical,
    otherVertical: otherVertical,
    specialization: specialization,
    otherspecialization: otherspecialization, 
    caseStudyName: trainingProgramType,
    scenarioDescription: scenarioDescription,
    learningObjectives: learningObjectives,
    technologies: technologies,
    difficulty: difficulty,
    duration: duration,
    numOfDevs: numberOfDevelopers,
  };

  const navigate = useNavigate();
  const backToHome = () => {
    navigate('/');
  };

  const handleMouseDown = () => {
    // Hide the tooltip when the field is clicked
    document.querySelector('.MuiTooltip-popper').style.visibility = 'hidden';
  };

  const handleChangeTags = (newTags) => {
    settechnologies(newTags);
  };

  const handleAddRowObj = () => {
    
    if (!objective) {
      setlearningObjectiveError('Please enter a learning objective');
      
    } else {
      if (editIndex !== null) {
        const updatedObjectives = [...learningObjectives];
        updatedObjectives[editIndex] = objective;
        setlearningObjectives(updatedObjectives);
        setEditIndex(null);
        
      } else {
        let newObjectives = [...learningObjectives, objective];
        setlearningObjectives(newObjectives);
        console.log('jj')
      }
      setobjective('');
      console.log('jj')
    }
  };

  const handleRemoveRowObj = (dataToRemove) => {
    const filterdLearningObjectives = [...learningObjectives].filter(
      (item) => item !== dataToRemove
    );
    setlearningObjectives(filterdLearningObjectives);
  };

  const handleEditRowObj = (index, objective) => {
    setEditIndex(index);
    setobjective(objective);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    let valid = true;

    if (!vertical) {
      setverticalError('Please select a domain');
      valid = false;
    } else if(vertical==='Other' && !otherVertical){
      setverticalError('Please write other domain');
      valid = false;
    }else {
      setverticalError('');
    }

    

    if (!specialization) {
      setspecializationError('Please select a specialization');
      valid = false;
    } else if(specialization==='Other' && !otherspecialization){
      setspecializationError('Please write other specialization');
      valid = false;
    } else {
      setspecializationError('');
    }

    if (!trainingProgramType) {
      setCaseStudyNameError('Please enter a name for the case study');
      valid = false;
    } else {
      setCaseStudyNameError('');
    }

    if (!scenarioDescription) {
      setscDescError('Please enter a brief description of the problem statement');
      valid = false;
    } else {
      setscDescError('');
    }

    // if (!difficulty) {
    //   setdifficultyError('Please select a difficulty level');
    //   valid = false;
    // } else {
    //   setdifficultyError('');
    // }

    // if (!duration || duration < 0) {
    //   setdurationError('Please enter a number > 0');
    //   valid = false;
    // } else {
    //   setdurationError('');
    // }

    // if (!numberOfDevelopers || numberOfDevelopers < 0) {
    //   setnumOfDevsError('Please enter a number > 0');
    //   valid = false;
    // } else {
    //   setnumOfDevsError('');
    // }

    // if (learningObjectives.length === 0) {
    //   setlearningObjectiveError('Please enter at least 1 learning objective');
    //   valid = false;
    // } else {
    //   setlearningObjectiveError('');
    // }

    // if (technologies.length === 0) {
    //   setTechnologiesError('Please enter at least 1 technology');
    //   valid = false;
    // } else {
    //   setTechnologiesError('');
    // }

    if (valid) {
      console.log('sada');
      setisLoading(true);
      console.log(formData);
      try {
        const response = await fetch(
          // https://mentormate-server.fly.dev
          'https://mentormate-server.fly.dev/api/v1/ai/create/case-study',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }
        );
        if (!response.ok) throw new Error('Network response was not ok.');
        const answer = await response.json();

        setMessage(answer.answer);
      } catch (error) {
        console.log('There has been a problem with your fetch operation:', error);
      } finally {
        setisLoading(false);
      }
    }
  };

  const handleReset = () => {
    setvertical('');
    setOtherVertical('');
    setspecialization('');
    setotherspecialization('');
    settrainingProgramType('');
    setscenarioDescription('');
    setlearningObjectives([]);
    settechnologies([]);
    setdifficulty('');
    setDuration('');
    setNumberOfDevelopers('');
    setverticalError('');
    setotherverticalError('');
    setCaseStudyNameError('');
    setspecializationError('');
    setotherspecializationError('');
    setscDescError('');
  };

  const saveMarkDownFile = () => {
    const blob = new Blob([message], { type: 'text/markdown' });
    const anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = `${formData.caseStudyName}.docs`;
    anchor.click();
  };

  
  

  return (
    <>
      <div className='header-p'>
        <button className='back-button' onClick={backToHome}>
          <ArrowBackIosNewIcon style={{color:"white"}} />
        </button>
        <div className='title-container'>
          <h3>Case Study Creator</h3>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='form-p'>
        <div className='form-table-p'>
          <div className='form-row-p'>
            <div className='form-cell-p'>
              <FormControl fullWidth>
                <InputLabel id='vert-label'>Domain<span style={{color:'red'}}>*</span></InputLabel>
                <StyledTooltip title='Select domain for the case study' arrow>


                <Select
  error={!!verticalError}
  fullWidth
  margin='normal'
  onMouseDown={handleMouseDown}
  labelId='vertical-labels'
  id='vertical-select'
  name='vertical'
  label='Vertical'
  value={vertical}
  onChange={(e) => {
    if (verticalError.length > 1) {
      setverticalError('');
    }
    setvertical(e.target.value);
    setOtherVertical('');
  }}
  MenuProps={{
    MenuListProps: {
      style: {
        color: 'rgb(97,97,97)', // Change text color
        fontFamily: 'Roboto, sans-serif', // Change font family
      },
    },
  }}
>
  {/* Add the "Other" option here */}
  {/* <MenuItem value='Other'>
    Other
  </MenuItem>
  {ITsector.Verticals.map((option, idx) => (
    <MenuItem key={idx} value={option}>
      {option}
    </MenuItem>
  ))}
</Select> */}

<MenuItem value=''>Select Domain</MenuItem>
        {ITsector.Verticals.map((option, idx) => (
          <MenuItem key={idx} value={option}>
            {option}
          </MenuItem>
        ))}
        <MenuItem value='Other'>Other</MenuItem>
      </Select></StyledTooltip>
      {vertical === 'Other' && (
        <StyledTooltip title='Write domain for the case study' arrow>
        <TextField
          id='other-vertical'
          label={<span>Other Domain<span style={{color:'red'}}>*</span></span>}
          fullWidth
          type='text'
          className='textinput'
          margin='normal'
          error={!!otherverticalError}
          value={otherVertical}
          // onChange={handleOtherVerticalChange}
          onChange={(e) => {
            setverticalError('');
            if (!assessmentNameRegex.test(e.target.value)) {
              setverticalError('Please write proper domain name');
              setOtherVertical('');
              // return false; 
            }else
            setOtherVertical(e.target.value);
          }}
        /></StyledTooltip>
      )}




                  <div className='error-message'>
                    {verticalError && <span>{verticalError}</span>}
                  </div>
                
              </FormControl>
            </div>
            <div className='form-cell-p'>
              <FormControl fullWidth>
                <InputLabel id='sp-label'>Specialization<span style={{color:'red'}}>*</span></InputLabel>
                <StyledTooltip
                  title='Select specialization for case study'
                  arrow
                >
                  <Select
                    error={!!specializationError}
                    fullWidth
                    margin='normal'
                    onMouseDown={handleMouseDown}
                    helperText='Specialization is required'
                    labelId='specialization-labels'
                    id='specialization-select'
                    name='specialization'
                    label='speicialization'
                    value={specialization}
                    onChange={(e) => {
                      if (specializationError.length > 1) {
                        setspecializationError('');
                      }
                      setspecialization(e.target.value);
                      setotherspecialization('');
                    }}
                    MenuProps={{
                      MenuListProps: {
                        style: {
                          color: 'rgb(97,97,97)', // Change text color
                          fontFamily: 'Roboto, sans-serif', // Change font family
                        },
                      },
                    }}
                  >
                    <MenuItem value=''>
                      <em>Select Specialization</em>
                    </MenuItem>
                    {specializationOptions.map((option, idx) => (
                      <MenuItem key={idx} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                    <MenuItem value='Other'>Other</MenuItem>
                  </Select>
                </StyledTooltip>
                {specialization === 'Other' && (
        <StyledTooltip title='Write specialization for the case study' arrow>
        <TextField
          id='other-specialization'
          label={<span>Other Specialization<span style={{color:'red'}}>*</span></span>}
          fullWidth
          type='text'
          className='textinput'
          margin='normal'
          error={!!otherspecializationError}
          value={otherspecialization}
          // onChange={handleOtherVerticalChange}
          onChange={(e) => {
            setspecializationError('');
            if (!assessmentNameRegex.test(e.target.value)) {
              setspecializationError('Please write correct specialization');
              setotherspecialization('');
              // return false; 
            }else
            setotherspecialization(e.target.value);
          }}
        /></StyledTooltip>
      )}
                <div className='error-message'>
                  {specializationError && <span>{specializationError}</span>}
                </div>
              </FormControl>
            </div>
          </div>
          <div className='case-study '>
            <FormControl fullWidth>
              <TextField
                error={!!caseStudyNameError}
                fullWidth
                id='outlined-basic'
                className='textinput'
                type='text'
                name='assessmentName'
                placeholder='Enter Case Study Name'
                label={<span>Case Study Name<span style={{color:'red'}}>*</span></span>}
                value={trainingProgramType}
                onChange={(e) => {
                  if (caseStudyNameError.length > 1) {
                    setCaseStudyNameError('');
                  }
                  settrainingProgramType(e.target.value);
                }}
              />
              <div className='error-message'>
                {caseStudyNameError && <span>{caseStudyNameError}</span>}
              </div>
            </FormControl>
          </div>
          <div className='sc-desc'>
            <FormControl fullWidth error={false}>
              <TextField
                error={!!scDescError}
                fullWidth
                name='text' 
                label={<span>Scenario Description<span style={{color:'red'}}>*</span></span>}
                multiline
                rows={4}
                value={scenarioDescription}
                onChange={(e) => {
                  if (scDescError.length > 1) {
                    setscDescError('');
                  }
                  setscenarioDescription(e.target.value);
                }}
              />
              <div className='error-message'>
                {scDescError && <span>{scDescError}</span>}
              </div>
            </FormControl>
          </div>
          <div className='learning-objectives'>
            <List dense={true}>
              {learningObjectives.map((data, index) => (
                <div key={index}>
                  <ListItem>
                    {editIndex === index ? (
                      <TextField
                        value={objective}
                        onChange={(e) => setobjective(e.target.value)}
                        onBlur={handleAddRowObj}
                        autoFocus
                      />
                    ) : (
                      <ListItemText primary={`${index + 1}. ${data}`} />
                    )}
                    <span className='edit-button'>
                      <Tooltip title='Edit'>
                        <EditIcon onClick={() => handleEditRowObj(index, data)} />
                      </Tooltip>
                    </span>
                    <span className='remove-button' onClick={() => handleRemoveRowObj(data)}>
                      <Tooltip title='Delete'>
                        <DeleteIcon />
                      </Tooltip>
                    </span>
                  </ListItem>
                </div>
              ))}
            </List>
            <FormControl fullWidth error={!!learningObjectiveError}>
              <TextField
                // error={!!learningObjectiveError}
                fullWidth
                id='outlined-basic'
                className='textinput'
                type='text'
                name='learning Objectives'
                placeholder='Click on + icon to add input'
                label='Learning Objectives'
                value={objective}
                onChange={(e) => {
                  if (learningObjectiveError.length > 1) {
                    setlearningObjectiveError('');
                  }
                  setobjective(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddRowObj();
                  }
                }}
              />
              {/* <div className='error-message'>
                {learningObjectiveError && <span>{learningObjectiveError}</span>}
              </div> */}
            </FormControl>
            <StyledTooltip title='Click to add learning objective' arrow>
              <button type='button' className='button-p add-button' onClick={handleAddRowObj}>
                <AddIcon />
              </button>
            </StyledTooltip>
          </div>























          <div className='form-row-p'>
            <StyledTooltip title='Add technologies(Ex:java,springboot,healthcare robotics...) for case study' arrow>
              <FormControl fullWidth error={false}>
                <TagInput
                  placeHolder={'keywords'}
                  initialTags={technologies}
                  // suggestions={toolsTechnologies}
                  onTagsChange={(newTags) => handleChangeTags(newTags)}
                />
                {/* <div className='error-message tech-error'>
                  {technologiesError && <span>{technologiesError}</span>}
                </div> */}
              </FormControl>
            </StyledTooltip>
          </div>

          <div className='form-row-p'>
            <div className='form-cell-p '>
              <StyledTooltip title='Select difficulty for case study' arrow>
                <FormControl fullWidth error={false}>
                  <InputLabel id='diff-label'>Difficulty </InputLabel>
                  <Select
                    // error={!!difficultyError}
                    fullWidth
                    margin='normal'
                    onMouseDown={handleMouseDown}
                    helperText='Difficulty is required'
                    labelId='diff-labels'
                    id='diff-select'
                    name='difficulty'
                    label='Difficulty'
                    value={difficulty}
                    onChange={(e) => {
                      if (difficultyError.length > 1) {
                        setdifficultyError('');
                      }
                      setdifficulty(e.target.value);
                    }}
                    MenuProps={{
                      MenuListProps: {
                        style: {
                          color: 'rgb(97,97,97)', // Change text color
                          fontFamily: 'Roboto, sans-serif', // Change font family
                        },
                      },
                    }}
                  >
                    <MenuItem value=''>
                      <em>Select Difficulty</em>
                    </MenuItem>
                    {difficultyOptions.map((option, idx) => (
                      <MenuItem key={idx} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <div className='error-message'>
                    {difficultyError && <span>{difficultyError}</span>}
                  </div> */}
                </FormControl>
              </StyledTooltip>
            </div>

            <div className='form-cell-p'>
              <FormControl fullWidth error={false}>
                <InputLabel>Duration (hrs)</InputLabel>
                <OutlinedInput
                  // error={!!durationError}
                  fullWidth
                  helperText='Duration  must be greater than 0'
                  name='duration'
                  id='duration'
                  value={duration}
                  onChange={(e) => {
                    if (durationError.length > 1) {
                      setdurationError('');
                    }
                    setDuration(e.target.value);
                  }}
                  label='Duration (hrs)'
                  type='number'
                  inputProps={{ min: 1 }}
                />
                {/* <div className='error-message'>
                  {durationError && <span>{durationError}</span>}
                </div> */}
              </FormControl>
            </div>
<div className='form-cell-p '>
  <FormControl fullWidth>
    <InputLabel>Number of Developers</InputLabel>
    <OutlinedInput
      name='num_of_devs'
      id='numOfDevs'
      value={numberOfDevelopers}
      onChange={(e) => setNumberOfDevelopers(e.target.value)}
      type='number'
      inputProps={{ min: 0 }}
    />
  </FormControl>
</div>


          </div>
          <div className='form-row-p '></div>
        </div>

        <div className={message.length > 0 ? 'gen-dwn-btn' : 'genbtn'}>
          {message.length > 0 && (
            <StyledTooltip title='download in .md format' arrow>
              <button
                type='button'
                className='button-p  download-button'
                onClick={saveMarkDownFile}
              >
                <DownloadIcon />
              </button>
            </StyledTooltip>
          )}{' '}
          <StyledTooltip title='Reset' arrow>
            <div>
              <button
                type='button'
                onClick={handleReset}
                className='button-p reset-btn'
                disabled={false}
              >
                <RefreshIcon />
              </button>
            </div>
          </StyledTooltip>
          <button className='button-p generate-button-p' type='submit'>
            Generate
          </button>
        </div>
      </form>
      {isLoading && (
        <div className='loading-dots'>
          <Spinner />
        </div>
      )}
      {message.length > 0 && (
        <div className='markdownResponse'>
          <CaseStudyResponse answer={message} />
        </div>
      )}
    </>
  );
};

export default CaseStudyCreator;
