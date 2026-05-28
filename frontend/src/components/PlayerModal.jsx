import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const PlayerModal = ({ open, handleClose, player, onSubmit, loading }) => {
  const isEdit = !!player;

  const formik = useFormik({
    initialValues: {
      name: player?.name || '',
      rank: player?.rank || '',
      ovr: player?.ovr || '',
      position: player?.position || '',
      team: player?.team || '',
      nation: player?.nation || '',
      league: player?.league || '',
      gender: player?.gender || 'Men',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      rank: Yup.number().required('Required').positive().integer(),
      ovr: Yup.number().required('Required').min(1).max(99),
      position: Yup.string().required('Required'),
      team: Yup.string().required('Required'),
      nation: Yup.string().required('Required'),
      league: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Player' : 'Add New Player'}</DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                name="name"
                label="Player Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="rank"
                label="Rank"
                type="number"
                value={formik.values.rank}
                onChange={formik.handleChange}
                error={formik.touched.rank && Boolean(formik.errors.rank)}
                helperText={formik.touched.rank && formik.errors.rank}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="ovr"
                label="OVR"
                type="number"
                value={formik.values.ovr}
                onChange={formik.handleChange}
                error={formik.touched.ovr && Boolean(formik.errors.ovr)}
                helperText={formik.touched.ovr && formik.errors.ovr}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="position"
                label="Position"
                value={formik.values.position}
                onChange={formik.handleChange}
                error={formik.touched.position && Boolean(formik.errors.position)}
                helperText={formik.touched.position && formik.errors.position}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                name="gender"
                label="Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <MenuItem value="Men">Men</MenuItem>
                <MenuItem value="Women">Women</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="team"
                label="Team"
                value={formik.values.team}
                onChange={formik.handleChange}
                error={formik.touched.team && Boolean(formik.errors.team)}
                helperText={formik.touched.team && formik.errors.team}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="league"
                label="League"
                value={formik.values.league}
                onChange={formik.handleChange}
                error={formik.touched.league && Boolean(formik.errors.league)}
                helperText={formik.touched.league && formik.errors.league}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="nation"
                label="Nation"
                value={formik.values.nation}
                onChange={formik.handleChange}
                error={formik.touched.nation && Boolean(formik.errors.nation)}
                helperText={formik.touched.nation && formik.errors.nation}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {isEdit ? 'Update Player' : 'Add Player'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PlayerModal;
