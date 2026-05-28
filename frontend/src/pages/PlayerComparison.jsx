import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Autocomplete,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Helmet } from 'react-helmet-async';
import playerService from '../services/playerService';
import statsService from '../services/statsService';
import toast from 'react-hot-toast';

const PlayerComparison = () => {
  const [loading, setLoading] = useState(false);
  const [playerOptions, setPlayerOptions] = useState([]);
  const [selectedP1, setSelectedP1] = useState(null);
  const [selectedP2, setSelectedP2] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Load player options for autocomplete
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await playerService.getPlayers({ limit: 100 });
        setPlayerOptions(res.data);
      } catch (error) {
        console.error('Failed to load player options');
      }
    };
    fetchOptions();
  }, []);

  const handleCompare = async () => {
    if (!selectedP1 || !selectedP2) {
      toast.error('Please select two players to compare');
      return;
    }
    if (selectedP1._id === selectedP2._id) {
      toast.error('Please select two different players');
      return;
    }

    setLoading(true);
    try {
      const res = await statsService.comparePlayers(selectedP1._id, selectedP2._id);
      const { player1, player2 } = res.data;
      setComparisonData({ player1, player2 });

      // Format data for Radar Chart
      const stats = [
        { subject: 'Pace', p1: player1.pace || 0, p2: player2.pace || 0 },
        { subject: 'Shooting', p1: player1.shooting || 0, p2: player2.shooting || 0 },
        { subject: 'Passing', p1: player1.passing || 0, p2: player2.passing || 0 },
        { subject: 'Dribbling', p1: player1.dribbling || 0, p2: player2.dribbling || 0 },
        { subject: 'Defending', p1: player1.defending || 0, p2: player2.defending || 0 },
        { subject: 'Physical', p1: player1.physical || 0, p2: player2.physical || 0 },
      ];
      setChartData(stats);
    } catch (error) {
      toast.error('Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStatRow = (label, val1, val2) => (
    <TableRow hover>
      <TableCell align="right" sx={{ width: '40%', fontWeight: val1 > val2 ? 'bold' : 'normal', color: val1 > val2 ? 'primary.main' : 'inherit' }}>
        {val1}
      </TableCell>
      <TableCell align="center" sx={{ width: '20%', fontWeight: 'bold', bgcolor: 'grey.100' }}>
        {label}
      </TableCell>
      <TableCell align="left" sx={{ width: '40%', fontWeight: val2 > val1 ? 'bold' : 'normal', color: val2 > val1 ? 'secondary.main' : 'inherit' }}>
        {val2}
      </TableCell>
    </TableRow>
  );

  return (
    <Box className="animate-fade-in">
      <Helmet>
        <title>Compare Players | EA Sports FC 26</title>
      </Helmet>
      
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Player Comparison Tool
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <Autocomplete
              options={playerOptions}
              getOptionLabel={(option) => `${option.name} (${option.ovr}) - ${option.team}`}
              value={selectedP1}
              onChange={(event, newValue) => setSelectedP1(newValue)}
              renderInput={(params) => <TextField {...params} label="Select First Player" variant="outlined" />}
            />
          </Grid>
          <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">VS</Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Autocomplete
              options={playerOptions}
              getOptionLabel={(option) => `${option.name} (${option.ovr}) - ${option.team}`}
              value={selectedP2}
              onChange={(event, newValue) => setSelectedP2(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Second Player" variant="outlined" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={handleCompare}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Compare Players'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {comparisonData && (
        <Grid container spacing={3}>
          {/* Radar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>Attribute Comparison</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name={comparisonData.player1.name}
                    dataKey="p1"
                    stroke="#1976d2"
                    fill="#1976d2"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name={comparisonData.player2.name}
                    dataKey="p2"
                    stroke="#dc004e"
                    fill="#dc004e"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Detailed Stats Table */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 500, overflow: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: 'primary.main' }}>
                    {comparisonData.player1.ovr}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{comparisonData.player1.name}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: 'secondary.main' }}>
                    {comparisonData.player2.ovr}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{comparisonData.player2.name}</Typography>
                </Box>
              </Box>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {renderStatRow('Overall', comparisonData.player1.ovr, comparisonData.player2.ovr)}
                    {renderStatRow('Rank', comparisonData.player2.rank, comparisonData.player1.rank)} {/* Lower rank is better */}
                    {renderStatRow('Pace', comparisonData.player1.pace, comparisonData.player2.pace)}
                    {renderStatRow('Shooting', comparisonData.player1.shooting, comparisonData.player2.shooting)}
                    {renderStatRow('Passing', comparisonData.player1.passing, comparisonData.player2.passing)}
                    {renderStatRow('Dribbling', comparisonData.player1.dribbling, comparisonData.player2.dribbling)}
                    {renderStatRow('Defending', comparisonData.player1.defending, comparisonData.player2.defending)}
                    {renderStatRow('Physical', comparisonData.player1.physical, comparisonData.player2.physical)}
                    {renderStatRow('Age', comparisonData.player2.age, comparisonData.player1.age)} {/* Younger usually preferred */}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default PlayerComparison;
