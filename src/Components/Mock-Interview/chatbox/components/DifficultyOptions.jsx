import React from 'react';

const DifficultyOptions = ({ actions }) => {
    const handleDifficultySelection = (difficulty) => {
        actions.finalResult(difficulty);
        
        
        console.log(difficulty)
      };
      

  return (
    <div>
      <button className='start-btn' onClick={() => handleDifficultySelection("Basic")}>Basic 🌱</button>
      <button className='start-btn' onClick={() => handleDifficultySelection("Intermediate")}>Intermediate 🌳</button>
      <button className='start-btn' onClick={() => handleDifficultySelection("Advance")}>Advance 🌲</button>
      <button className='start-btn' onClick={() => handleDifficultySelection("Mix of all")}>Mix of all 🎨</button>
    </div>
  );
};

export default DifficultyOptions;
