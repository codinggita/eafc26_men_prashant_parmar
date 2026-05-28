import { TextField } from '@mui/material';

const Input = ({ label, ...props }) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      margin="normal"
      {...props}
    />
  );
};

export default Input;
