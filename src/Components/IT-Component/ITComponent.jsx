import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ITComponent.css';
import data from '../IT.json';
import TagInput from './TagInput';
import axios from 'axios'; // Import Axios for making HTTP requests
import Spinner from '../Spinner';
import MarkdownPreview from '@uiw/react-markdown-preview';
import * as XLSX from 'xlsx'; // Import all functions from xlsx library
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FormHelperText from '@mui/material/FormHelperText';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BorderClear, FormatListNumbered, WidthFull } from '@mui/icons-material';
import { Button, MenuItem, Select, TextField, InputLabel, FormControl, OutlinedInput } from '@mui/material';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ITComponent(props) {
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
  // console.log(props)
  // console.log(props.assessmentName)
  const [quizData, setQuizData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isResetEnabled, setIsResetEnabled] = useState(false);
  const [formData, setFormData] = useState([
    {
      programmingLanguage: '',
      specializations: '',
      concepts: [],
      toolsTechnologies: [],
      level: '',
      noOfQuestions: '',
    },
  ]);

  const [totalQuestions, setTotalQuestions] = useState(0);
  // const [errors, setErrors] = useState({});
  const [isRedirect, setIsRedirect] = useState(false);
  const [isAnsReady, setIsAnsReady] = useState(false);
  const [resp, setResp] = useState('');
  const responseContainerRef = useRef(null); // Initialize the ref here

  const calculateTotalQuestions = () => {
    let total = 0;
    formData.forEach(data => {
      total += parseInt(data.noOfQuestions || 0);
    });
    setTotalQuestions(total);
  };

  useEffect(() => {
    calculateTotalQuestions();
  }, [formData]);

  const parseResponseString = responseString => {
    const questions = responseString.split('**Question');

    // Remove the first empty element
    questions.shift();

    return questions.map(question => {
      const [questionWithCode, answerText] = question.split('**Answer:');

      const [questionText, codeSnippet] = questionWithCode.split('```');

      const optionsAndCode = questionText.split('\n').filter(line => line.trim() !== '');
      const questionWithoutCode = optionsAndCode[0];
      const options = optionsAndCode.slice(1);
      // console.log(options)
      const optionss = [];
      const extractOptions = question => {
        const optionRegex = /[A-D]\.\s*(.*)/g;
        let match;

        while ((match = optionRegex.exec(question)) !== null) {
          optionss.push(match[1]);
        }
      };
      if (codeSnippet != null) {
        extractOptions(question);
        options[1] = optionss[0];
        options[2] = optionss[1];
        options[3] = optionss[2];
        options[4] = optionss[3];
      }

      const answer = answerText.trim();

      return {
        question: questionWithoutCode.trim(),
        options: options.map(option => option.trim()),
        codeSnippet: codeSnippet ? codeSnippet.trim() : null,
        answer,
      };
    });
  };

  const programmingLanguages = data.Sectors[0].ProgrammingLanguages;
  const concepts = data.Sectors[0].concepts;
  const toolsTechnologies = data.Sectors[0].ToolsTechnologiesPlatformsFrameworks;
  const levels = ['Easy', 'Medium', 'Hard'];
  const specializationsOptions = data.Sectors[0].Specializations;

  const [spErrors, setSpErrors] = useState(Array(formData.length).fill(false));
  const [conceptErrors, setConceptErrors] = useState(Array(formData.length).fill(false));
  const [lvlErrors, setLvlErrors] = useState(Array(formData.length).fill(false));
  const [nfQErrors, setNfQErrors] = useState(Array(formData.length).fill(false));

  const validateField = (name, value, index) => {
    let errorMsg = '';
    switch (name) {
      case 'specializations':
        if (!value) {
          errorMsg = 'Specialization is required';
          setSpErrors(spErrors => spErrors.map((error, idx) => (idx === index ? true : error)));
        } else {
          setSpErrors(spErrors => spErrors.map((error, idx) => (idx === index ? false : error)));
        }
        break;
      case 'concepts':
        if (!value || value.length === 0) {
          errorMsg = 'At least one concept is required';
          setConceptErrors(conceptErrors => conceptErrors.map((error, idx) => (idx === index ? true : error)));
        } else {
          setConceptErrors(conceptErrors => conceptErrors.map((error, idx) => (idx === index ? false : error)));
        }
        break;
      case 'level':
        if (!value) {
          errorMsg = 'Please select a difficulty level';
          setLvlErrors(lvlErrors => lvlErrors.map((error, idx) => (idx === index ? true : error)));
        } else {
          setLvlErrors(lvlErrors => lvlErrors.map((error, idx) => (idx === index ? false : error)));
        }
        break;
      case 'noOfQuestions':
        if (!value || isNaN(value)) {
          errorMsg = 'Number of questions must be greater than 0';
          setNfQErrors(nfQErrors => nfQErrors.map((error, idx) => (idx === index ? true : error)));
        } else {
          setNfQErrors(nfQErrors => nfQErrors.map((error, idx) => (idx === index ? false : error)));
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [`${name}${index}`]: errorMsg, // Ensure keys match with props
    }));
    return errorMsg;
  };

  const handleChange = (index, event) => {
    setIsResetEnabled(true);
    const { name, value } = event.target;
    console.log('Field Name:', name);
    console.log('Field Value:', value);
    console.log('Event:', event);
      
    const newFormData = [...formData];
    newFormData[index][name] = name === 'concepts' ? value.split(',').map(concept => concept.trim()) : value;
     
    if(name==='noOfQuestions'){
      
      newFormData[index][name]=value < 1 || value > 10 || !/^\d*$/.test(value) ? 10 : value;
      
    }
    
    setFormData(newFormData);
    console.log('Form Data:', newFormData);
    validateField(name, value, index);
    // validateCurrentFormData()
  };

  // const handleNumberOfQuestionsChange = (index, value) => {
    
    
  //   const newFormData = [...formData];
  //   newFormData[index].noOfQuestions= value < 1 || value > 10 || !/^\d*$/.test(value) || value === '' ? 10 : value;

  //   setFormData(newFormData);
  //   console.log('Form Data:', newFormData);
  //   validateField('noOfQuestions', value, index);
   
    
  // };



  const validateCurrentFormData = () => {
    const newErrors = {};
    formData.forEach((data, index) => {
      // Validate each field in the row
      Object.keys(data).forEach(fieldName => {
        const value = data[fieldName];
        // Reuse the existing validateField logic for each type of field
        const errorMessage = validateField(fieldName, value, index);
        if (errorMessage) {
          newErrors[`${fieldName}${index}`] = errorMessage;
        }
      });
    });
    setErrors(newErrors); // Update the state with the new errors
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const handleAddRow = () => {
    // console.log(formData); // Or submit your form data

    if (validateCurrentFormData()) {
      // Only add new row if current data is valid
      const lastEntry = formData[formData.length - 1];
      setFormData([...formData, { ...lastEntry, level: '', noOfQuestions: '' }]);
      setSpErrors(spErrors => [...spErrors, false]);
      setConceptErrors(conceptErrors => [...conceptErrors, false]);
      setLvlErrors(lvlErrors => [...lvlErrors, false]);
      setNfQErrors(nfQErrors => [...nfQErrors, false]);
      // Note: No need to clear errors for the new row, as it will be empty initially
    } // onMouseDown={handleMouseDown}
    else {
      // alert('Please correct the errors in the form before adding a new set of questions.');
    }
  };

  const handleRemoveRow = dataToRemove => {
    const newFormData = formData.filter(item => item !== dataToRemove);
    setFormData(newFormData);
  };

  const handleChangeTags = (index, newTags) => {
    setIsResetEnabled(true);
    const newFormData = [...formData];
    newFormData[index].concepts = newTags;
    setFormData(newFormData);
    validateField('concepts', newTags, index);
    // validateCurrentFormData()
  };

  const handleChangeToolsTechnologies = useCallback(
    
    (index, newTags) => {
      setIsResetEnabled(true);
      const newFormData = [...formData];
      newFormData[index].toolsTechnologies = newTags;
      setFormData(newFormData);
      validateField('toolsTechnologies', newTags, index);
    },
    [formData],
  );

  const navigate = useNavigate();
  const handleReset = () => {
    // Reset the form data to contain only one empty row
    setFormData([
      {
        programmingLanguage: '',
        specializations: '',
        concepts: [],
        toolsTechnologies: [],
        level: '',
        noOfQuestions: '',
      },
    ]);
    setIsResetEnabled(false);
    setNfQErrors([false]);
    setLvlErrors([false]);
    setConceptErrors([false]);
    setSpErrors([false]);
    setIsAnsReady(false);
    props.FreezeHandler();
    
  };


  const handleSubmit = async event => {
    event.preventDefault(); // Move this line to the beginning of the function

    if (validateCurrentFormData()) {
      let isValid = true;
      const newErrors = {};
      formData.forEach((form, index) => {
        Object.keys(form).forEach(key => {
          const value = form[key];
          const errorMsg = validateField(key, key === 'concepts' || key === 'toolsTechnologies' ? value : value, index);
          if (errorMsg) {
            isValid = false;
            newErrors[`${key}${index}`] = errorMsg;
          }
        });
      });

      if (!isValid) {
        setErrors(newErrors);
      } else {
        setErrors({});

        // Or submit your form data

        const payload = {
          entries: formData,
        };

        // console.log(payload);
        try {
          // Make POST request to backend
          setIsRedirect(true);
          setIsAnsReady(false);
          // console.log(payload);
          // const response = await fetch(
          //   "https://mentormate-server-black-sound-2178.fly.dev/api/v1/ai/createAssessment",
          //   {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify(payload),
          //   }
          // );
          const response = await axios.post('https://mentormate-server.fly.dev/api/v1/ai/createAssessment', payload);
          // const response = await axios.post(
          //   "https://mentormate-server-black-sound-2178.fly.dev/api/v1/ai/createAssessment",
          //   {
          //     method: "POST",
          //     headers: { "Content-Type": "application/json" },
          //     body: JSON.stringify(payload),
          //   }
          // );

          setIsRedirect(false);
          setIsAnsReady(true);
          // console.log(response);
          setResp(response.data.answer);
          try {
            const quizDataa = parseResponseString(response.data.answer);
            // const quizDataa = parseQuizData(response.data.answer);

            setQuizData(quizDataa);
            setIsRedirect(false);
          } catch (error) {
            toast.error('Oh no, something went wrong!');
            setIsRedirect(false);
            setIsRedirect(false);
            setIsAnsReady(false);
          }
        } catch (error) {
          toast.error('Oh no, something went wrong!');
          // alert("Error from server")
          setIsRedirect(false);
          setIsAnsReady(false);
          console.error('Error:', error);
        }
      }
    }

    // console.log(quizData);
  };

  useEffect(() => {
    if (isAnsReady) {
      responseContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isAnsReady]);

  const downloadExcel = () => {
    if (quizData.length > 0) {
      const cleanedData = quizData.map(item => {
        const cleanedItem = {};
        Object.keys(item).forEach(key => {
          if (typeof item[key] === 'string') {
            cleanedItem[key] = item[key].replace(/^\*\*/, '').replace(/\*\*$/, '');
          } else {
            cleanedItem[key] = item[key];
          }
        });
        return cleanedItem;
      });

      const formattedData = cleanedData.map(item => {
        const formattedItem = {};
        // Clean options and add them as separate columns
        item.options.forEach((option, index) => {
          if (item.codeSnippet == null) {
            formattedItem[`option${index + 1}`] = index === 0 ? option : option.substring(2); // Trim first two characters
          } else {
            formattedItem[`option${index + 1}`] = index === 0 ? option : option; // Trim first two characters
          }
        });
        formattedItem.codeSnippet = item.codeSnippet; // Place codeSnippet between option1 and option2

        // Clean answer field
        if (typeof item.answer === 'string') {
          formattedItem.answer = item.answer.replace(/^\*\*/, '').replace(/\*\*$/, ''); // Remove '**' at start and end
          if (formattedItem.answer.startsWith('.')) {
            const dotIndex = formattedItem.answer.indexOf('.');
            formattedItem.answer = dotIndex !== -1 ? formattedItem.answer.substring(0, dotIndex) : formattedItem.answer;
          } else {
            // const dotIndex = formattedItem.answer.indexOf('.');
            formattedItem.answer = formattedItem.answer.substring(formattedItem.answer.indexOf('.') + 1).trim(); // Trim text before first '.'
          }
        } else {
          formattedItem.answer = item.answer;
        }

        return formattedItem;
      });

      // console.log(formattedData);

      const formattedDataa = formattedData.map(item => {
        return {
          Question: item.option1,
          codeSnippet: item.codeSnippet,
          A: item.option2,
          B: item.option3,
          C: item.option4,
          D: item.option5,

          answer: item.answer.replace(/^\*\*/, '').replace(/\*\*$/, ''), // Clean answer
        };
      });

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      // Convert formattedData to worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedDataa);
      // Add worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, props.assessmentName);
      // Write the workbook to a buffer
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // Convert buffer to blob
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = props.assessmentName + '.xlsx';

      // Trigger download
      document.body.appendChild(a);
      a.click();
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <div className="it-component">
        <form onSubmit={handleSubmit}>
          {formData.map((data, index) => (
            <div key={index} className="form-roww">
              <div className="programmingLanguage">
               
                  {/* <FormControl fullWidth error={errors[`specializations${index}`] !== undefined}> */}
                  <FormControl fullWidth error={spErrors[index]}>
                    <InputLabel id="sp-label">Sepecialization*</InputLabel>
                    <StyledTooltip title="Select specialization for assessment" arrow>
                    <Select
                      fullWidth
                      margin="normal"
                      // helperText={errors[`specializations${index}`]}
                      helperText="Specialization is required"
                      labelId="sp-labels"
                      id="sp-select"
                      name="specializations"
                      label="Specializations*"
                      value={data.specializations}
                      onChange={(event) => handleChange(index, event)}
                      onMouseDown={handleMouseDown}
                      sx={{
                        maxHeight: '45px',
                        '.MuiOutlinedInput-input': { maxHeight: '45px', overflow: 'auto' },
                        '.MuiSvgIcon-root': { maxHeight: '45px' },
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
                       
                      <MenuItem value="">
                        <em>Select Specialization</em>
                      </MenuItem>
                      {specializationsOptions.map((specialization, idx) => (
                        <MenuItem key={idx} value={specialization}>
                          {specialization}
                        </MenuItem>
                      ))}
                    </Select>
                    </StyledTooltip>
                    {/* {errors[`specializations${index}`] !== undefined ? */}
                    {spErrors[index] ? <FormHelperText id="component-error-text">Specialization is required</FormHelperText> : <></>}
                  </FormControl>
                
              </div>
              <div className="programmingLanguage">
                
                  <FormControl fullWidth>
                    <InputLabel id="pl">Programming Language</InputLabel>
                    <StyledTooltip title="Select programming Language for assessment (optional)" arrow>
                    <Select
                      fullWidth
                      label="Programming Language"
                      name="programmingLanguage"
                      onMouseDown={handleMouseDown}
                      value={data.programmingLanguage}
                      onChange={event => handleChange(index, event)}
                      sx={{
                        maxHeight: '45px',
                        '.MuiOutlinedInput-input': { maxHeight: '45px', overflow: 'auto' },
                        '.MuiSvgIcon-root': { maxHeight: '45px' },
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
                      <MenuItem value="Select Programming Language">
                        <em>Select Programming Language</em>
                      </MenuItem>
                      {programmingLanguages.map((language, idx) => (
                        <MenuItem key={idx} value={language}>
                          {language}
                        </MenuItem>
                      ))}
                    </Select>
                    </StyledTooltip>
                    
                  </FormControl>
                
              </div>

              <div className="concept-input-container">
                
                  <FormControl error={conceptErrors[index]}>

                    {/* <label htmlFor="concepts">
                    Concepts
                    <span className="info-icon" title="Select or enter concepts">
                      i
                    </span>
                  </label> */}
                  <StyledTooltip title="Select or enter the concepts you want for assessment" arrow>
                    <TagInput
                      initialTags={data.concepts}
                      suggestions={concepts}
                      placeHolder={'concepts*'}
                      onTagsChange={newTags => handleChangeTags(index, newTags)}
                      onMouseDown={handleMouseDown}
                    />
                    {conceptErrors[index] ? <FormHelperText id="component-error-text" style={{marginTop:'3px'}}>Select at least one concept</FormHelperText> : <></>}
                    </StyledTooltip>
                  </FormControl>
                

                <FormControl  style={{marginTop:'10px'}}>
                  <StyledTooltip title="Select or enter the tools & technologies for the assessment" arrow>
                    <TagInput
                      placeHolder={'tools and technologies'}
                      initialTags={data.toolsTechnologies}
                      suggestions={toolsTechnologies}
                      onMouseDown={handleMouseDown}
                      onTagsChange={newTags => handleChangeToolsTechnologies(index, newTags)}
                     
                    />

                    <div className="error">{errors[`toolsTechnologies${index}`]}</div>
                  </StyledTooltip>
                </FormControl>
              </div>
              <div className="levell">
                <div className="levell1">
                  <FormControl fullWidth error={lvlErrors[index]}>
                    <InputLabel htmlFor={`number-of-questions-input-${index}`}>Difficulty Level*</InputLabel>
                    <StyledTooltip title="Select the difficulty level" arrow>
                    <Select
                      fullWidth
                      // error={errors[`level${index}`] !== undefined}
                      helperText={errors[`level${index}`]}
                      id={`number-of-questions-input-${index}`}
                      label="level*"
                      name="level"
                      value={data.level}
                      onChange={event => handleChange(index, event)}
                      sx={{
                        maxHeight: '45px',
                        '.MuiOutlinedInput-input': { maxHeight: '45px', overflow: 'auto' },
                        '.MuiSvgIcon-root': { maxHeight: '45px' },
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
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {levels.map((level, idx) => (
                        <MenuItem key={idx} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                    </StyledTooltip>
                    {lvlErrors[index] ? <FormHelperText id="component-error-text">Please select a difficulty level</FormHelperText> : <></>}
                  </FormControl>
                </div>

                <div className="levell1">
                  {/* <FormControl fullWidth error={errors[`noOfQuestions${index}`] !== undefined}> */}
                  <FormControl fullWidth error={nfQErrors[index]}>
                    <InputLabel htmlFor={`number-of-questions-input-${index}`}>Number of Questions*</InputLabel>
                    <StyledTooltip title="Enter the number of questions" arrow>
                    <OutlinedInput
                      fullWidth
                      // error={errors[`noOfQuestions${index}`] !== undefined}
                      helperText="Please enter number of questions"
                      name="noOfQuestions"
                      id={`number-of-questions-input-${index}`}
                      value={data.noOfQuestions}
                      onChange={(event) => handleChange(index, event)}
                      label="Number of Questions*"
                      type="number"
                      inputProps={{ min: 1, max: 30 }}
                      sx={{ maxHeight: '45px', '.MuiOutlinedInput-input': { maxHeight: '45px', overflow: 'auto' } }}
                    />
                    </StyledTooltip>
                    {nfQErrors[index] ? (
                      <FormHelperText id="component-error-text">Please enter number of questions</FormHelperText>
                    ) : (
                      <></>
                    )}
                  </FormControl>
                </div>
                <div className="levell2">
                  {formData.length !== 1 && (
                    <StyledTooltip title="Remove entry from assessment" arrow>
                      <Button
                        onMouseDown={handleMouseDown}
                        variant="outlined"
                        onClick={() => handleRemoveRow(data)}
                        style={{ marginRight: '10px', maxWidth: '40px', border: '1px solid red' }}
                      >
                        <DeleteIcon sx={{ color: 'red' }} />
                      </Button>
                    </StyledTooltip>
                  )}
                  {formData.length - 1 === index && (
                    <>
                    <StyledTooltip title="Reset" arrow>
              <Button variant="contained" onClick={handleReset} disabled={!isResetEnabled} style={{ maxWidth: '10px', marginRight: '10px' }}>
                <RefreshIcon/>
              </Button>
              </StyledTooltip>
                      <StyledTooltip title="Add another entry for assessment" arrow>
                        <Button
                          onMouseDown={handleMouseDown}
                          variant="contained"
                          onClick={handleAddRow}
                          style={{ marginRight: '10px', height: '35px', Width: '20px', maxWidth: '20px', border: 'none' }}
                        >
                          <AddIcon />
                        </Button>
                      </StyledTooltip>

                      {/* <Button
                      type="button"
                      className="assessment-add-button"
                      onClick={handleAddRow}
                    > */}

                      {/* </Button> */}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="last">
            <div className="totalQ">
              <p>Total Questions</p>
              <p className="total-q">{totalQuestions}</p>
            </div>
            <div className="sub-btn">
              <Button variant="contained" type="submit">
                Generate
              </Button>
              {isAnsReady ? (
                <StyledTooltip title="Download results in excel file" arrow>
                  <Button
                    type="button"
                    className="download-btn"
                    onClick={downloadExcel}
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
        </form>
      </div>

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
                <MarkdownPreview source={resp} />
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default ITComponent;
