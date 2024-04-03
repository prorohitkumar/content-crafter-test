import React, { useContext, useState } from 'react';
import { ChatContext } from '../ActionProvider'; // Import your context

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function StartQuizBtn(props) {
  const { domain, role, specific_topic, difficulty_level } = props.state.userData;
  const { updateState, createChatBotMessage } = useContext(ChatContext); // Use useContext hook to access context
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [introMessageShown, setIntroMessageShown] = useState(false);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);

  const handleNext = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setShowAnswers(prevState => ({ ...prevState, [questions[currentQuestionIndex].id]: false }));
      setAnswerVisible(false); // Hide the answer when moving to the next question
    } else {
      // If there are no more questions, handle end of quiz logic
      handleEnd();
    }
  };

  const handleEnd = () => {
    // Handle end of quiz logic, e.g., show results
    setQuizCompleted(true);
    updateState(createChatBotMessage("Quiz completed! You can review your performance and try again if you'd like to improve."));
  };

  const handleToggleAnswer = () => {
    setAnswerVisible(prevState => !prevState);
  };

  const fetchData = async () => {
    try {
      setFetchingQuestions(true);
      const response = await fetch('http://127.0.0.1:5000/generate_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domain, role, specific_topic, difficulty_level })
      });
      const data = await response.json();
      console.log('Interview questions:', data.questions);
      setQuestions(data.questions);
      setIntroMessageShown(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetchingQuestions(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {!quizCompleted && !introMessageShown && (
        <button className='start-btn' onClick={fetchData}>Start</button>
      )}
      {(fetchingQuestions ) && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </div>
      )}
      {(!quizCompleted || introMessageShown) && !fetchingQuestions && (
        <>
          {introMessageShown && (
            <Card sx={{ maxWidth: 345, margin: 'auto', marginTop: '20px', backgroundColor: '#3c82bc' }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ color: '#fff' }}>
                  {questions[currentQuestionIndex]?.question}
                </Typography>
                {answerVisible && (
                  <Typography variant="body2" color="text.secondary" style={{ color: '#fff' }}>
                    {questions[currentQuestionIndex]?.answer}
                  </Typography>
                )}
              </CardContent>
              <CardActions style={{ justifyContent: 'space-between' }}>
                {!quizCompleted && (
                  <Button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} sx={{ color: '#07FF38 ', fontWeight: 'bold',  '&:hover': { backgroundColor: '#d0d0d0' } }} variant="outlined" size="medium" color="primary" >Next</Button>
                )}
                {!quizCompleted && (
                  <Button onClick={handleEnd} sx={{ color: 'red', fontWeight: 'bold',  '&:hover': { backgroundColor: '#d0d0d0' }  }} variant="outlined" size="medium" color="primary" >End</Button>
                )}
                <Button onClick={handleToggleAnswer} style={{ fontWeight: 'bold', fontSize: '16px', alignSelf: 'flex-end', color: '#000' }}>
                  {answerVisible ? "Hide Answer" : "View Answer"}
                </Button>
              </CardActions>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
