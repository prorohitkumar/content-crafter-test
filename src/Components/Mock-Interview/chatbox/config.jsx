import { createChatBotMessage } from 'react-chatbot-kit';
import StartBtn from './components/StartBtn';

import StartQuizBtn from './components/StartQuizBtn';
import DifficultyOptions from './components/DifficultyOptions';



const config = {
    botName: "ContentCrafter Bot",
    initialMessages: [createChatBotMessage(`🌟 Welcome to your personalized mock interview session! 🌟`, {
      widget: "startBtn"
  })],
    state: {
        checker: null,
        userData: {
            domain: "",
            role: "",
            specific_topic: "",
            difficulty_level: ""
        },
        questions:""
    },
    widgets: [

    
      {
        widgetName: "startBtn",
        widgetFunc: (props) => <StartBtn {...props} />,
    },
    {
      widgetName: "difficultyOptions",
      widgetFunc: (props) => <DifficultyOptions {...props} />,
    },
    {
      widgetName: "startQuizBtn",
      widgetFunc: (props) => <StartQuizBtn {...props} />,
  },
    ]
};

export default config;