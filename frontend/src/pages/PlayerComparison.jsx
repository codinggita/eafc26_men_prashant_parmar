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
        { subject: 'Pace', p1: parseInt(player1.PAC) || 0, p2: parseInt(player2.PAC) || 0 },
        { subject: 'Shooting', p1: parseInt(player1.SHO) || 0, p2: parseInt(player2.SHO) || 0 },
        { subject: 'Passing', p1: parseInt(player1.PAS) || 0, p2: parseInt(player2.PAS) || 0 },
        { subject: 'Dribbling', p1: parseInt(player1.DRI) || 0, p2: parseInt(player2.DRI) || 0 },
        { subject: 'Defending', p1: parseInt(player1.DEF) || 0, p2: parseInt(player2.DEF) || 0 },
        { subject: 'Physical', p1: parseInt(player1.PHY) || 0, p2: parseInt(player2.PHY) || 0 },
      ];
      setChartData(stats);
    } catch (error) {
      toast.error('Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStatRow = (label, val1, val2) => {
    const num1 = parseInt(val1) || 0;
    const num2 = parseInt(val2) || 0;
    return (
      <TableRow hover>
        <TableCell align="right" sx={{ width: '40%', fontWeight: num1 > num2 ? 'bold' : 'normal', color: num1 > num2 ? 'primary.main' : 'inherit' }}>
          {val1}
        </TableCell>
        <TableCell align="center" sx={{ width: '20%', fontWeight: 'bold', bgcolor: 'grey.100' }}>
          {label}
        </TableCell>
        <TableCell align="left" sx={{ width: '40%', fontWeight: num2 > num1 ? 'bold' : 'normal', color: num2 > num1 ? 'secondary.main' : 'inherit' }}>
          {val2}
        </TableCell>
      </TableRow>
    );
  };

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
              getOptionLabel={(option) => `${option.Name} (${option.OVR}) - ${option.Team}`}
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
              getOptionLabel={(option) => `${option.Name} (${option.OVR}) - ${option.Team}`}
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
                    name={comparisonData.player1.Name}
                    dataKey="p1"
                    stroke="#1976d2"
                    fill="#1976d2"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name={comparisonData.player2.Name}
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
                    {comparisonData.player1.OVR}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{comparisonData.player1.Name}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1, bgcolor: 'secondary.main' }}>
                    {comparisonData.player2.OVR}
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{comparisonData.player2.Name}</Typography>
                </Box>
              </Box>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {renderStatRow('Overall', comparisonData.player1.OVR, comparisonData.player2.OVR)}
                    {renderStatRow('Rank', comparisonData.player2.Rank, comparisonData.player1.Rank)} {/* Lower rank is better */}
                    {renderStatRow('Pace', comparisonData.player1.PAC, comparisonData.player2.PAC)}
                    {renderStatRow('Shooting', comparisonData.player1.SHO, comparisonData.player2.SHO)}
                    {renderStatRow('Passing', comparisonData.player1.PAS, comparisonData.player2.PAS)}
                    {renderStatRow('Dribbling', comparisonData.player1.DRI, comparisonData.player2.DRI)}
                    {renderStatRow('Defending', comparisonData.player1.DEF, comparisonData.player2.DEF)}
                    {renderStatRow('Physical', comparisonData.player1.PHY, comparisonData.player2.PHY)}
                    {renderStatRow('Age', comparisonData.player2.Age, comparisonData.player1.Age)} {/* Younger usually preferred */}
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
