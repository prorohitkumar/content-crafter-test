import React, { useState, useEffect, useCallback } from 'react';
import data from '../IT.json';
import TagInput from '../IT-Component/TagInput';
import { useNavigate } from 'react-router-dom';
const OtherComponent = () => {
 
  
      const navigate = useNavigate();
  
    const [formData, setFormData] = useState([
      { programmingLanguage: '', specializations: '', concepts: [], toolsTechnologies: [], level: '', noOfQuestions: '' },
    ]);
  
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [errors, setErrors] = useState({});
  
    const calculateTotalQuestions = () => {
      let total = 0;
      formData.forEach((data) => {
        total += parseInt(data.noOfQuestions || 0);
      });
      setTotalQuestions(total);
    };
  
    useEffect(() => {
      calculateTotalQuestions();
    }, [formData]);
  
    const programmingLanguages = data.Sectors[0].ProgrammingLanguages;
    const concepts = data.Sectors[0].concepts;
    const toolsTechnologies = data.Sectors[0].ToolsTechnologiesPlatformsFrameworks;
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    const specializationsOptions = data.Sectors[0].Specializations;
  
    const validateField = (name, value, index) => {
      let errorMsg = '';
      switch (name) {
        case 'programmingLanguage':
          if (!value) errorMsg = 'Programming language is required';
          break;
        case 'specializations':
          if (!value) errorMsg = 'Specialization is required';
          break;
        case 'concepts':
          if (!value || value.length === 0) errorMsg = 'At least one concept is required';
          break;
        case 'toolsTechnologies':
          if (!value || value.length === 0) errorMsg = 'At least one tool/technology is required';
          break;
        case 'level':
          if (!value) errorMsg = 'Level is required';
          break;
        case 'noOfQuestions':
          if (!value) errorMsg = 'Number of questions is required';
          else if (isNaN(value) || parseInt(value) <= 0) errorMsg = 'Enter a valid number of questions';
          break;
        default:
          break;
      }
      setErrors(prevErrors => ({ ...prevErrors, [`${name}${index}`]: errorMsg }));
      return errorMsg;
    };
  
    const handleChange = (index, event) => {
      const { name, value } = event.target;
      const newFormData = [...formData];
      newFormData[index][name] = name === 'concepts' ? value.split(',').map(concept => concept.trim()) : value;
      setFormData(newFormData);
      validateField(name, value, index);
    };
  
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
    
    console.log(formData); // Or submit your form data
  
    if (validateCurrentFormData()) { // Only add new row if current data is valid
      const lastEntry = formData[formData.length - 1];
      setFormData([...formData, { ...lastEntry, level: '', noOfQuestions: '' }]);
        // Note: No need to clear errors for the new row, as it will be empty initially
    } else {
        // alert('Please correct the errors in the form before adding a new set of questions.');
    }
  };
  
  
    const handleRemoveRow = (dataToRemove) => {
      const newFormData = formData.filter((item) => item !== dataToRemove);
      setFormData(newFormData);
    };
  
    const handleChangeTags = (index, newTags) => {
      const newFormData = [...formData];
      newFormData[index].concepts = newTags;
      setFormData(newFormData);
      validateField('concepts', newTags, index);
    };
  
    const handleChangeToolsTechnologies = useCallback((index, newTags) => {
      const newFormData = [...formData];
      newFormData[index].toolsTechnologies = newTags;
      setFormData(newFormData);
      validateField('toolsTechnologies', newTags, index);
    }, [formData]);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      let isValid = true;
      const newErrors = {};
      formData.forEach((form, index) => {
        Object.keys(form).forEach((key) => {
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
        // alert('Please correct the errors before submitting.');
      } else {
        setErrors({});
        navigate('/work-in-progress')
        console.log(formData); // Or submit your form data
      }
    };
  
    return (
      <div className="it-component">
        <form onSubmit={handleSubmit}>
          {formData.map((data, index) => (
            <div key={index} className="form-roww">
              <div className='programmingLanguage'>
                <label>Specialization<span className="info-icon" title="Select the specialization for the questions">i</span>
                <div className="error">{errors[`specializations${index}`]}</div></label>
                <select required name="specializations" value={data.specializations} onChange={(event) => handleChange(index, event)}>
                  <option value="">Select Specialization</option>
                  {specializationsOptions.map((specialization, idx) => (
                    <option key={idx} value={specialization}>{specialization}</option>
                  ))}
                </select>
              </div>
              {/* <div className='programmingLanguage'>
                <label>Programming Language <span className="info-icon" title="Select the Programming for the questions">i</span>
                <div className="error">{errors[`programmingLanguage${index}`]}</div>
  </label>
                <select name="programmingLanguage" value={data.programmingLanguage} onChange={(event) => handleChange(index, event)}>
                  <option value="">Select Programming Language</option>
                  {programmingLanguages.map((language, idx) => (
                    <option key={idx} value={language}>{language}</option>
                  ))}
                </select>
              </div> */}
              <div className="concept-input-container">
                <label htmlFor="concepts">Concepts<span className="info-icon" title="Select or enter concepts">i</span></label>
                <TagInput initialTags={data.concepts} suggestions={concepts} onTagsChange={(newTags) => handleChangeTags(index, newTags)} />
                <div className="error">{errors[`concepts${index}`]}</div>
  
                <label>Tools & Technologies<span className="info-icon" title="Select or enter Tools & technology for the questions">i</span></label>
                <TagInput initialTags={data.toolsTechnologies} suggestions={toolsTechnologies} onTagsChange={(newTags) => handleChangeToolsTechnologies(index, newTags)} />
                <div className="error">{errors[`toolsTechnologies${index}`]}</div>
              </div>
              <div className='level'>
                <div>
                  <label>Level</label>
                  <select name="level" value={data.level} onChange={(event) => handleChange(index, event)}>
                    <option value="">Select</option>
                    {levels.map((level, idx) => (
                      <option key={idx} value={level}>{level}</option>
                    ))}
                  </select>
                  <div className="error">{errors[`level${index}`]}</div>
                </div>
                <div>
                  <label>No. of Questions</label>
                  <input type="number" name="noOfQuestions" value={data.noOfQuestions} onChange={(event) => handleChange(index, event)} />
                  <div className="error">{errors[`noOfQuestions${index}`]}</div>
                </div>
                <div>
                  {formData.length !== 1 && (
                    <button type="button" className="remove-button" onClick={() => handleRemoveRow(data)}>
                      -
                    </button>
                  )}
                  {formData.length - 1 === index && (
                    <button type="button" className="add-button" onClick={handleAddRow}>
                      +
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="last">
            <div className='totalQ'>
              <p>Total No. of Questions</p>
              <label>{totalQuestions}</label>
            </div>
            <div className="sub-btn">
              <button type="submit">Generate</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
  
export default OtherComponent;