import React from 'react';

import { Chatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css'
import ActionProvider from './chatbox/ActionProvider';
import MessageParser from './chatbox/MessageParser';
import config from './chatbox/config';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';
import '../../App.css';


export default function MockInterview() {
  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    '& .MuiTooltip-tooltip': {
      top: 'calc(-2vh + 10px)',
      fontSize: '13px',
      backgroundColor: '#007bff;',
      // marginTop:'20px'
      // Adjust background color as needed
    },
  }));



  const navigate = useNavigate();


  const backToHome = () => {
    navigate('/');
  };

  return (
    <div className="mockInterviewBody">
      <div className="header">
        <button className="back-button" onClick={backToHome}>
          <ArrowBackIosNewIcon style={{ color: 'white' }} />
        </button>
        <div className="title-container">
          <h3>Mock Interviewer</h3>
        </div>
      </div>
      <div className="card">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
      </div>
    </div>
  );
}
