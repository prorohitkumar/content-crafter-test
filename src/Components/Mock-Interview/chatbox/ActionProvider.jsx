import React, { createContext, useState, useContext } from 'react';

export const ChatContext = createContext();

const ActionProvider = ({ createChatBotMessage, setState, children }) => {

  const initialAction = () => {
    const message = createChatBotMessage(` I'm here to help you practice for your big day. First things first, could you tell me which domain or industry you're targeting? (e.g., IT, HR)`);
    updateState(message, "domain");
  }

  const afterInitialMessage = (domain) => {
    if (!domain) {
      const errorMessage = createChatBotMessage("Please provide a valid domain.");
      updateState(errorMessage, "domain");
      return;
    }
  
    const message = createChatBotMessage(`Fantastic choice! The ${domain} industry is brimming with opportunities. 🚀 Now, could you specify the role or job profile you're aiming for? (e.g., Full Stack Developer, Cloud Programmer, HR Recruiter, Application QA, Project Manager, Solution Architect)`);
    updateState(message, "role");
  }

  const afterDomainMessage = (role) => {
    if (!role) {
      const errorMessage = createChatBotMessage("Please provide a valid role.");
      updateState(errorMessage, "role");
      return;
    }

    const message = createChatBotMessage(`A ${role}, what an exciting role! Before we dive in, let's close in on the topics you'd like to tackle. Please type the topics, separated by comma (eg., Competitive Programming, Data Structure and Algorithms, Python, React, Cloud Security, Data Modelling, UX Design, Junit Tests, DevOps, Digital Marketing):`);
    updateState(message, "specific_topic");
  }

  const afterRoleMessage = (specific_topic) => {
    if (!specific_topic) {
      const errorMessage = createChatBotMessage("Please provide topics!");
      updateState(errorMessage, "specific_topic");
      return;
    }
    console.log("This is  afterrole checker")
    const message = createChatBotMessage("Thanks for letting me know your preferred topics! Before we dive in, let's tailor the difficulty of the questions to your preference. Please select the type of questions you'd like to tackle:", {
      widget: "difficultyOptions",
    });

    updateState(message, "difficulty_level");

  }

  const finalResult = (difficulty_level) => {
    console.log("Difficulty level received:", difficulty_level);
    
    // Check if difficulty_level is not provided
    if (!difficulty_level) {
      console.log("Difficulty level is not provided.");
      const errorMessage = createChatBotMessage("Please provide valid inputs for all fields.");
      updateState(errorMessage, "difficulty_level");
      return;
    }
  
    // Construct message using difficulty_level
    const message = createChatBotMessage(`Great choice! You've selected a ${difficulty_level} quiz.👍 Get ready to showcase your skills and knowledge! 
    You can take some moment to prepare. Otherwise, if you ready to begin, click Start. 🚀`, {
      widget: "startQuizBtn"
    });
  
    // Update state with message
    updateState(message, "questions");
    console.log("State updated with message.");
  }
  

  const updateState = (message, checker) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      checker,
    }))
  }

    // Define the context value
    const contextValue = {
      updateState,
      createChatBotMessage,
    };

    return (
      <ChatContext.Provider value={contextValue}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            actions: {
              initialAction,
              afterInitialMessage,
              afterDomainMessage,
              afterRoleMessage,
              finalResult,
            },
          });
        })}
      </ChatContext.Provider>
    );
  };
  
  export default ActionProvider;