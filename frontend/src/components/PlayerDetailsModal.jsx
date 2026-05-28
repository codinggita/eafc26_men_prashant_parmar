import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';

const StatBar = ({ label, value, color }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={value} 
      sx={{ 
        height: 8, 
        borderRadius: 5,
        backgroundColor: `${color}20`,
        '& .MuiLinearProgress-bar': {
          backgroundColor: color,
        }
      }} 
    />
  </Box>
);

const PlayerDetailsModal = ({ open, handleClose, player }) => {
  if (!player) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{ 
          p: 3, 
          bgcolor: 'primary.main', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3 
        }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: 'primary.main', fontSize: '2rem', fontWeight: 'bold' }}>
            {player.ovr}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{player.name}</Typography>
            <Typography variant="subtitle1">{player.team} | {player.nation}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Chip label={player.position} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip label={`${player.age} Years`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Box>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2, fontWeight: 'bold', textTransform: 'uppercase' }}>
              Base Attributes
            </Typography>
            <StatBar label="Pace" value={player.pace} color="#1976d2" />
            <StatBar label="Shooting" value={player.shooting} color="#dc004e" />
            <StatBar label="Passing" value={player.passing} color="#2e7d32" />
            <StatBar label="Dribbling" value={player.dribbling} color="#ed6c02" />
            <StatBar label="Defending" value={player.defending} color="#9c27b0" />
            <StatBar label="Physical" value={player.physical} color="#795548" />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2, fontWeight: 'bold', textTransform: 'uppercase' }}>
              Other Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary">League</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{player.league}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary">Skill Moves</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{player.skillMoves} Stars</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary">Weak Foot</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{player.weakFoot} Stars</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary">Preferred Foot</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{player.foot || 'Right'}</Typography>
            </Box>
            {player.playstyles && player.playstyles.length > 0 && (
              <Box>
                <Typography variant="caption" color="textSecondary">Playstyles</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {player.playstyles.map((style, idx) => (
                    <Chip key={idx} label={style} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerDetailsModal;
