import React from 'react'
import { useLocation } from 'react-router-dom';
import './Output.css'
import MarkdownPreview from '@uiw/react-markdown-preview';



const Output = ({}) => {

    const location = useLocation();
  const responseData = location.state; 
  console.log(responseData.answer)// Access response data from location state

  return (
    <div className='output'>
      <h2>Response Data</h2>
      <div className="response-container">

      <MarkdownPreview source={responseData.answer}/>
      </div>
    </div>
  );
      }

export default Output