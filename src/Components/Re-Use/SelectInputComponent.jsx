
import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const SelectInputComponent = ({ id, labelId, label, value, options, handleInputChange }) => {
  return (
    <div>
      <Select
        labelId={labelId}
        id={id}
        value={value}
        label={label}
        onChange={handleInputChange}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default SelectInputComponent;
