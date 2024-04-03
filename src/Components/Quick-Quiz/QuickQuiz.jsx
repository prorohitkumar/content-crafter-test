import React, { useState } from 'react';
import './QuickQuiz.css'; // Make sure the path is correct
import MarkdownPreview from '@uiw/react-markdown-preview';
import Spinner from '../Spinner';
import data from '../IT.json';

const QuickQuiz = () => {
  const programmingLanguages = data.Sectors[0].ProgrammingLanguages;
  const concepts = data.Sectors[0].concepts;

  const [isAnswerReady, setIsAnswerReady] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Validation states
  const [errors, setErrors] = useState({});

  const [rows, setRows] = useState([
    {
      noOfQuestions: '',
      difficultyLevel: '',
    },
  ]);

  // for animation in heading
  const headingText = 'Quick Quiz';
  const headingLetters = headingText.split('').map((letter, index) => {
    // Check if the letter is a space and handle it differently
    if (letter === ' ') {
      return (
        <span key={index} style={{ display: 'inline-block', width: '0.5em' }}>
          &nbsp;
        </span>
      );
    } else {
      return (
        <span
          key={index}
          className='fade-in-letter'
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {letter}
        </span>
      );
    }
  });
  // till here


  const [concept, setConcept] = useState('');
  const [programmingLanguage, setProgrammingLanguage] = useState('');

  const validateInput = (name, value) => {
    switch (name) {
      case 'noOfQuestions':
        if (!value || value <= 0) {
          return 'Number of questions must be greater than 0';
        }
        break;
      case 'difficultyLevel':
        if (!value) {
          return 'Please select a difficulty level';
        }
        break;
      case 'programmingLanguage':
        if (!value) {
          return 'Please select a programming language';
        }
        break;
      case 'concept':
        if (!value) {
          return 'Please select a concept';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleAddRow = () => {
    if (rows.length < 3) {
      const newRow = { noOfQuestions: '', difficultyLevel: '' };
      setRows([...rows, newRow]);
    }
  };

  const handleRemoveRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const values = [...rows];
    values[index][name] = name === 'noOfQuestions' ? parseInt(value) || '' : value;

    // Validate input
    const error = validateInput(name, values[index][name]);
    setErrors({ ...errors, [`${name}${index}`]: error });

    setRows(values);
  };

  const handleConceptChange = (event) => {
    const error = validateInput(event.target.name, event.target.value);
    setErrors({ ...errors, concept: error });
    setConcept(event.target.value);
  };

  const handleProgrammingLanguageChange = (event) => {
    const error = validateInput(event.target.name, event.target.value);
    setErrors({ ...errors, programmingLanguage: error });
    setProgrammingLanguage(event.target.value);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    if (!programmingLanguage) {
      newErrors.programmingLanguage = 'Please select a programming language';
      valid = false;
    }
    if (!concept) {
      newErrors.concept = 'Please select a concept';
      valid = false;
    }
    rows.forEach((row, index) => {
      const questionError = validateInput('noOfQuestions', row.noOfQuestions);
      const levelError = validateInput('difficultyLevel', row.difficultyLevel);
      if (questionError) {
        newErrors[`noOfQuestions${index}`] = questionError;
        valid = false;
      }
      if (levelError) {
        newErrors[`difficultyLevel${index}`] = levelError;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsClick(true);
    setIsLoading(true);

    if (!validateForm()) {
      setIsClick(false);
      setIsLoading(false);
      return; // Stop form submission if validation fails
    }

    const payload = {
      programmingLanguage: programmingLanguage,
      concept: concept,
      meta: rows
        .map(({ noOfQuestions, difficultyLevel }) => ({
          noOfQuestions: noOfQuestions !== '' ? parseInt(noOfQuestions, 10) : 0,
          difficultyLevel,
        }))
        .filter(({ noOfQuestions }) => noOfQuestions > 0),
    };

    console.log(payload);
    try {
      const response = await fetch(
        'https://mentormate-server-black-sound-2178.fly.dev/api/v1/ai/create/quickQuiz',
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
    <>
      <div className='heading-container'>
        <h1>{headingLetters}</h1>
      </div>
      <div className='content-container'>
        <div className='form-container'>
          <div className='form-qq form-table-qq'>
            <form className='forms-container' onSubmit={handleSubmit}>
              <div className='program-container form-row-qq'>
                <select name='programmingLanguage' value={programmingLanguage} onChange={handleProgrammingLanguageChange}>
                  <option value=''>Select Programming Language</option>
                  {programmingLanguages.map((language, idx) => (
                    <option key={idx} value={language}>{language}</option>
                  ))}
                </select>
                {errors.programmingLanguage && <div className="error">{errors.programmingLanguage}</div>}
              </div>
              <div className='concepts-container form-row-qq'>
                <select name='concept' value={concept} onChange={handleConceptChange}>
                  <option value=''>Select Concept</option>
                  {concepts.map((concept, idx) => (
                    <option key={idx} value={concept}>{concept}</option>
                  ))}
                </select>
                {errors.concept && <div className="error">{errors.concept}</div>}
              </div>
              <div className='form-row-qq'>
                {rows.map((row, index) => (
                  <div key={index}>
                    <div className='form-cell-qq'>
                      <input
                        type='number'
                        name='noOfQuestions'
                        className='input_numOfQuestions'
                        placeholder='No. of Questions'
                        value={row.noOfQuestions}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      {errors[`noOfQuestions${index}`] && <div className="error">{errors[`noOfQuestions${index}`]}</div>}
                    </div>
                    <div className='form-cell-qq'>
                      <select
                        name='difficultyLevel'
                        value={row.difficultyLevel}
                        onChange={(e) => handleInputChange(index, e)}
                      >
                        <option value=''>Level</option>
                        <option value='Easy'>Easy</option>
                        <option value='Medium'>Medium</option>
                        <option value='Hard'>Hard</option>
                      </select>
                      {errors[`difficultyLevel${index}`] && <div className="error">{errors[`difficultyLevel${index}`]}</div>}
                    </div>
                    <div className='add-button-container form-cell-qq'>
                    {rows.length > 1 && (
                      <button type="button" className='remove-button' onClick={() => handleRemoveRow(index)}>
                        -
                      </button>
                    )}

                    {index === rows.length - 1 && (

                        <button type='button' className={`add-row-button ${rows.length >= 3 ? 'disabled' : ''}`} id='btn+width' onClick={handleAddRow} disabled={rows.length >= 3}>
                          +
                        </button>
                    )}
                                          </div>

                    
                  </div>
                ))}
              </div>
              <div className='submit-btn-container'>
                <button type='submit'>Generate</button>
              </div>
            </form>
          </div>
        </div>
        <div>
          {!isClick ? <></> : <>
            {isLoading ? <Spinner /> :
              <div className="response-container">
                <MarkdownPreview source={message} />
              </div>}
          </>}
        </div>
      </div>
    </>
  );
};

export default QuickQuiz;