import React, { useState } from 'react';
import './QuickQuizz.css';
import { FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Spinner from '../Spinner';
import MarkdownPreview from '@uiw/react-markdown-preview';
import data from '../IT.json';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


const QuickQuizz = () => {

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      top:'calc(-2vh + 10px)',
      fontSize: '13px', 
      backgroundColor: '#007bff;',
      // marginTop:'20px'
       // Adjust background color as needed
    },
  }));

  const handleMouseDown = () => {
    // Hide the tooltip when the field is clicked
    document.querySelector('.MuiTooltip-popper').style.visibility = 'hidden';
  };

  
  const [isAnswerReady, setIsAnswerReady] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const welcomeText = "Hello, I'm your Quick Quiz Generator,a dedicated agent poised to assist you in crafting personalized quizzes effortlessly.";
  const [language, setLanguage] = useState('');
  const [concept, setConcept] = useState('');
  const [questionSets, setQuestionSets] = useState([{ numberOfQuestions: '', difficulty: '' }]);
  const [addClickCount, setAddClickCount] = useState(0);
  const [isResetEnabled, setIsResetEnabled] = useState(false);

  const languages = data.Sectors[0].ProgrammingLanguages;
  const concepts = data.Sectors[0].concepts;


  const [languageError, setLanguageError] = useState('');
  const [conceptError, setConceptError] = useState('');
  const [questionSetErrors, setQuestionSetErrors] = useState(Array.from({ length: questionSets.length }, () => ({ numberOfQuestionsError: '', difficultyError: '' })));
  const [isFieldsFrozen, setIsFieldsFrozen] = useState(false);

  const navigate = useNavigate();
  const backToHome = () =>{
    navigate("/")
  }
  
 

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    setIsResetEnabled(true);
    updateFieldFreeze(event.target.value, concept); // Update freeze state
    setLanguageError('');
  };

  const handleConceptChange = (event) => {
    setConcept(event.target.value);
    setIsResetEnabled(true);
    updateFieldFreeze(language, event.target.value); // Update freeze state
    setConceptError('');
  };

   const updateFieldFreeze = (selectedLanguage, selectedConcept) => {
    // Freeze fields if both language and concept are selected
    setIsFieldsFrozen(selectedLanguage !== '' && selectedConcept !== '');
  };

  const handleNumberOfQuestionsChange = (index, value) => {
    
    const updatedQuestionSets = [...questionSets];
    
    updatedQuestionSets[index].numberOfQuestions = value < 1 || value > 5 || !/^\d*$/.test(value) ? 5 : value;

    const numberOfQuestionsError = value === '-' ? 'Please enter number of questions' : '';
    const updatedErrors = [...questionSetErrors];
    updatedErrors[index].numberOfQuestionsError = numberOfQuestionsError;

    setQuestionSets(updatedQuestionSets);
    setQuestionSetErrors(updatedErrors);
    setIsResetEnabled(true);
    
  };

  const handleDifficultyChange = (index, value) => {
    const updatedQuestionSets = [...questionSets];
    const updatedErrors = [...questionSetErrors];

    updatedQuestionSets[index].difficulty = value;

     // Clear error for the selected set
    updatedErrors[index].difficultyError = '';
    updatedQuestionSets.forEach((set, i) => {
      if (i !== index) {
        const otherDifficulties = ['Easy', 'Medium', 'Hard'].filter(difficulty => difficulty !== value);
        updatedQuestionSets[i].difficulty = otherDifficulties.includes(set.difficulty) ? set.difficulty : '';
      }
    });

    setQuestionSets(updatedQuestionSets);
    setQuestionSetErrors(updatedErrors);
    setIsResetEnabled(true);
  };

  const addQuestionSet = () => {
    if (addClickCount < 2) {
      // Get all selected difficulty levels in existing sets
      const selectedDifficulties = questionSets.map(set => set.difficulty);
  
      // Filter out the selected difficulty levels from the list of available options
      const availableDifficulties = ['Easy', 'Medium', 'Hard'].filter(difficulty => !selectedDifficulties.includes(difficulty));
  
      // Create a new question set with default values and only the remaining difficulty levels
      const newSet = {
        numberOfQuestions: '',
        difficulty: availableDifficulties.length > 0 ? availableDifficulties[0] : ''
      };
  
      // Add the new question set to the list
      setQuestionSets([...questionSets, newSet]);
  
      // Dynamically increase the length of the questionSetErrors array
      setQuestionSetErrors([...questionSetErrors, { numberOfQuestionsError: '', difficultyError: '' }]);
      
      // Increment the click count
      setAddClickCount(addClickCount + 1);
  
      // Enable the reset button
      setIsResetEnabled(true);
    }
  };

  const deleteQuestionSet = (index) => {
    const filteredQuestionSets = questionSets.filter((_, idx) => idx !== index);
    setQuestionSets(filteredQuestionSets);
    setAddClickCount(prevCount => Math.max(0, prevCount - 1));
    setIsResetEnabled(true);
  };

  const handleReset = () => {
    setLanguage('');
    setConcept('');
    setQuestionSets([{ numberOfQuestions: '', difficulty: '' }]);
    setConceptError('');
    setLanguageError('');
    setQuestionSetErrors([{ numberOfQuestionsError: '', difficultyError: '' }]);
    setAddClickCount(0);
    setIsResetEnabled(false);
    setIsClick(false);
    setIsFieldsFrozen(false);

  };

  // const handleSubmit = (event) => {
    // event.preventDefault();
    // Form submission logic goes here
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsClick(true);
    setIsLoading(true);

    let valid = true;

  // Validate programming language
  if (!language) {
    setLanguageError('Please select a programming language');
    valid = false;
  } else {
    setLanguageError('');
  }

  // Validate concept
  if (!concept) {
    setConceptError('Please select a concept');
    valid = false;
  } else {
    setConceptError('');
  }

  // Validate number of questions and difficulty level for each set
  const newQuestionSetErrors = [...questionSetErrors];
  questionSets.forEach((set, index) => {
    if (!set.numberOfQuestions || isNaN(set.numberOfQuestions) || parseInt(set.numberOfQuestions) < 1 || parseInt(set.numberOfQuestions) > 5) {
      newQuestionSetErrors[index].numberOfQuestionsError = 'Please enter number of questions';
      valid = false;
    } else {
      newQuestionSetErrors[index].numberOfQuestionsError = '';
    }
    if (!set.difficulty) {
      newQuestionSetErrors[index].difficultyError = 'Please select a difficulty level';
      valid = false;
    } else {
      newQuestionSetErrors[index].difficultyError = '';
    }
  });
  setQuestionSetErrors(newQuestionSetErrors);

  if (!valid) {
    setIsLoading(false);
    setIsClick(false);
    return;
  }

    // if (!validateForm()) {
    //   setIsClick(false);
    //   setIsLoading(false);
    //   return; // Stop form submission if validation fails
    // }



    
  

    const payload = {
    language: language,
      concept: concept,
      meta: questionSets
        .map(({ numberOfQuestions, difficulty }) => ({
          numberOfQuestions: numberOfQuestions !== '' ? parseInt(numberOfQuestions, 10) : 0,
          difficulty,
        }))
        .filter(({ numberOfQuestions }) => numberOfQuestions > 0),
    };

    console.log(payload);
    try {
      const response = await fetch(
        'https://mentormate-server.fly.dev/api/v1/ai/create/quickQuiz',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error('Network response was not ok.');
      const answer = await response.json();
      setMessage(answer.answer);
      setIsAnswerReady(true);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setIsLoading(false);
      // setIsClick(fals);
    }
  };

  return (
    <div className="quick-quizz-container">
      <div className="left-portion">
        <div className="quick-header">
          <button className="back-button" onClick={backToHome}>
            <ArrowBackIosNewIcon style={{ color: 'white' }}/>
          </button>
          <div className="title-container">
            <h3>Quick Quiz Generator</h3>
          </div>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="language-simple-select-helper-label">Programming Language*</InputLabel>
              <StyledTooltip title="Select the programming language" arrow>
              <Select
                labelId="language-simple-select-helper-label"
                id="language-select"
                value={language}
                label="Programming Language"
                onChange={handleLanguageChange}
                error={!!languageError}
                onMouseDown={handleMouseDown} // Hide tooltip on mouse down
                disabled={isFieldsFrozen} // Disable field if fields are frozen
                MenuProps={{
                  MenuListProps: {
                    style: {
                      color: 'rgb(97,97,97)', // Change text color
                      fontFamily: 'Roboto, sans-serif', // Change font family
                    },
                  },
                }}
                >
                {languages.map((lang, index) => (
                  <MenuItem key={index} value={lang}>{lang}</MenuItem>
                ))}
              </Select>
              </StyledTooltip>
              <div className="error-message">
                 {languageError && <span>{languageError}</span>}
              </div>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="concept-label">Concept*</InputLabel>
              <StyledTooltip title="Select the concept" arrow>
              <Select
                labelId="concept-label"
                id="concept-select"
                value={concept}
                label="Concept"
                onChange={handleConceptChange}
                error={!!conceptError}
                onMouseDown={handleMouseDown}
                disabled={isFieldsFrozen} // Disable field if fields are frozen
                MenuProps={{
                  MenuListProps: {
                    style: {
                      color: 'rgb(97,97,97)', // Change text color
                      fontFamily: 'Roboto, sans-serif', // Change font family
                    },
                  },
                }}
              >
                {concepts.map((concept, index) => (
                  <MenuItem key={index} value={concept}>{concept}</MenuItem>
                ))}
              </Select>
              </StyledTooltip>
              <div className="error-message">
                 {conceptError && <span>{conceptError}</span>}
              </div>
            </FormControl>

            {questionSets.map((set, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel htmlFor={`number-of-questions-input-${index}`}>Number of Questions*</InputLabel>
                    <StyledTooltip title="Enter the number of questions (1-5)" arrow>
                    <OutlinedInput
                      id={`number-of-questions-input-${index}`}
                      value={set.numberOfQuestions}
                      onChange={(e) => handleNumberOfQuestionsChange(index, e.target.value)}
                      label="Number of Questions"
                      type="number"
                      inputProps={{ min: 1, max: 5 }}
                      error={!!questionSetErrors[index].numberOfQuestionsError}
                      onMouseDown={handleMouseDown}
                      // helpertext={questionSetErrors[index].numberOfQuestionsError}
                    />
                    </StyledTooltip>
                    <div className="error-message">
                    {questionSetErrors[index].numberOfQuestionsError && <span>{questionSetErrors[index].numberOfQuestionsError}</span>}
                    </div>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel htmlFor={`difficulty-select-${index}`}>Difficulty Level*</InputLabel>
                    <StyledTooltip title="Select the difficulty level" arrow>
                    <Select
                      labelId={`difficulty-label-${index}`}
                      id={`difficulty-select-${index}`}
                      value={set.difficulty}
                      label="Difficulty Level"
                      onChange={(e) => handleDifficultyChange(index, e.target.value)}
                      error={!!questionSetErrors[index].difficultyError}
                      onMouseDown={handleMouseDown}
                      MenuProps={{
                        MenuListProps: {
                          style: {
                            color: 'rgb(97,97,97)', // Change text color
                            fontFamily: 'Roboto, sans-serif', // Change font family
                          },
                        },
                      }}
                      // helpertext={questionSetErrors[index].difficultyError}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="Easy" disabled={set.difficulty === 'Easy'}>Easy</MenuItem>
                      <MenuItem value="Medium" disabled={set.difficulty === 'Medium'}>Medium</MenuItem>
                      <MenuItem value="Hard" disabled={set.difficulty === 'Hard'}>Hard</MenuItem>
                    </Select>
                    </StyledTooltip>
                    <div className="error-message">
                    {questionSetErrors[index].difficultyError && <span>{questionSetErrors[index].difficultyError}</span>}
                     </div>
                  </FormControl>
                </Grid>

                {questionSets.length > 1 && index === questionSets.length - 1 && (
                  <Grid item xs={12} sm={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledTooltip title="Remove set of questions" arrow>
                    <Button
                      variant="outlined"
                      onClick={() => deleteQuestionSet(index)}
                      style={{ marginRight: '10px', minWidth: '40px' , color: 'red'}}
                    >
                      <DeleteIcon />
                    </Button>
                    </StyledTooltip>
                    <StyledTooltip title="Add another set of questions" arrow>
                    <Button
                      variant="contained"
                      onClick={addQuestionSet}
                      disabled={addClickCount >= 2}
                    >
                      <AddIcon />
                    </Button>
                    </StyledTooltip>
                  </Grid>
                )}

                {questionSets.length === 1 && index === 0 && (
                  <Grid item xs={12} sm={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledTooltip title="Add another set of questions"arrow>
                    <Button
                      variant="contained"
                      onClick={addQuestionSet}
                      disabled={addClickCount >= 2}
                    > 
                      <AddIcon />
                    </Button>
                    </StyledTooltip>
                    
                  </Grid>
                )}
              </Grid>
            ))}

            <div className="button-container">
            <StyledTooltip title="Reset" arrow>
              <Button variant="contained" onClick={handleReset} disabled={!isResetEnabled} style={{ maxWidth: '10px', marginRight: '10px' }}>
                <RefreshIcon/>
              </Button>
              </StyledTooltip>
              <Button variant="contained" type="submit">
                Generate
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="right-portion">
       {/* <div className='response'>
        Response
       </div> */}

       <div>
          {!isClick ? <div className='response'>
        <div className='welcome'>{welcomeText}
             </div>
        </div> : <>
            {isLoading ? <div className='response'><Spinner /></div> :
              <div className="response">
                <MarkdownPreview className='response-content' source={message} />
              </div>}
          </>}
        </div>
      </div>
    </div>
  );
};

export default QuickQuizz;
