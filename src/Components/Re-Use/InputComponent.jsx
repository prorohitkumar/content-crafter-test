import React from 'react'

const InputComponent = ({ label, value, onChange }) => {
    return (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        variant="outlined"
        fullWidth
      />
    );
  };

export default InputComponent