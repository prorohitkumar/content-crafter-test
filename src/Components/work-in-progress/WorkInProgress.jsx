import React from 'react';
import './WorkInProgress.css'

const WorkInProgress = () => {
    
        return (
            <div className="work-in-progress-container">
                <svg
                    className="code-icon animate"
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <h1 className="animate" style={{color:'Red'}}>Coming Soon...</h1>
            </div>
        );
    };    

export default WorkInProgress