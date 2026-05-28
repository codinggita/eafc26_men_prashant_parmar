import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Slider,
  Typography,
  Box,
} from '@mui/material';
import { useState } from 'react';

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST', 'CF'];

const FilterModal = ({ open, handleClose, onApply, filters: currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters || {
    position: '',
    minOvr: 0,
    team: '',
    nation: '',
    gender: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (event, newValue) => {
    setFilters({ ...filters, minOvr: newValue });
  };

  const handleReset = () => {
    const resetFilters = {
      position: '',
      minOvr: 0,
      team: '',
      nation: '',
      gender: '',
    };
    setFilters(resetFilters);
    onApply(resetFilters);
    handleClose();
  };

  const handleApply = () => {
    onApply(filters);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Advanced Filters</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography gutterBottom color="textSecondary">Minimum Overall Rating (OVR)</Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={filters.minOvr}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={0}
                max={99}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Position"
              name="position"
              value={filters.position}
              onChange={handleChange}
            >
              <MenuItem value="">All Positions</MenuItem>
              {POSITIONS.map((pos) => (
                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={filters.gender}
              onChange={handleChange}
            >
              <MenuItem value="">Both</MenuItem>
              <MenuItem value="Men">Men</MenuItem>
              <MenuItem value="Women">Women</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Team / Club"
              name="team"
              value={filters.team}
              onChange={handleChange}
              placeholder="e.g. Real Madrid"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nation"
              name="nation"
              value={filters.nation}
              onChange={handleChange}
              placeholder="e.g. Brazil"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleReset} color="inherit">Reset All</Button>
        <Box>
          <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" color="primary">Apply Filters</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;
