import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { fetchPlayers, deletePlayer, addPlayer, updatePlayer } from '../features/players/playerSlice';
import PlayerModal from '../components/PlayerModal';
import FilterModal from '../components/FilterModal';
import PlayerDetailsModal from '../components/PlayerDetailsModal';
import toast from 'react-hot-toast';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

const PlayersList = () => {
  const dispatch = useDispatch();
  const { players, loading, pagination } = useSelector((state) => state.players);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [viewingPlayer, setViewingPlayer] = useState(null);
  const [filters, setFilters] = useState({
    position: '',
    minOvr: 0,
    team: '',
    nation: '',
    gender: '',
  });

  useEffect(() => {
    const params = { 
      page: page + 1, 
      limit: rowsPerPage, 
      search: searchTerm,
      ...filters
    };
    // Clean up empty params
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === 0) delete params[key];
      if (key === 'minOvr' && params[key]) {
        params.minovr = params[key]; // Map to backend param
        delete params.minOvr;
      }
    });
    dispatch(fetchPlayers(params));
  }, [dispatch, page, rowsPerPage, searchTerm, filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleOpenDetails = (player) => {
    setViewingPlayer(player);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setViewingPlayer(null);
    setIsDetailsOpen(false);
  };

  const handleExportCSV = () => {
    if (players.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Rank', 'Name', 'OVR', 'Position', 'Team', 'Nation', 'League', 'Age'];
    const csvRows = players.map(p => [
      p.rank,
      `"${p.name}"`,
      p.ovr,
      p.position,
      `"${p.team}"`,
      `"${p.nation}"`,
      `"${p.league}"`,
      p.age
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `EAFC26_Players_Export_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exporting players as CSV...');
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePlayer(deleteId)).unwrap();
      toast.success('Player deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error(error || 'Failed to delete player');
    }
  };

  const handleOpenModal = (player = null) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingPlayer(null);
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (values) => {
    try {
      if (editingPlayer) {
        await dispatch(updatePlayer({ id: editingPlayer._id, playerData: values })).unwrap();
        toast.success('Player updated successfully');
      } else {
        await dispatch(addPlayer(values)).unwrap();
        toast.success('Player added successfully');
      }
      handleCloseModal();
      dispatch(fetchPlayers({ page: page + 1, limit: rowsPerPage, search: searchTerm }));
    } catch (error) {
      toast.error(error || 'Something went wrong');
    }
  };

  return (
    <Box className="animate-fade-in">
      <Helmet>
        <title>Players Dataset | EA Sports FC 26</title>
      </Helmet>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Players Dataset
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
            >
              Add New Player
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              placeholder="Search players by name, team, or nation..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button 
              fullWidth 
              variant={Object.values(filters).some(v => v !== '' && v !== 0) ? "contained" : "outlined"} 
              startIcon={<FilterIcon />}
              onClick={() => setIsFilterOpen(true)}
              sx={{ height: '56px' }}
            >
              Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>OVR</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Position</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Team</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nation</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : players.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No players found.
                </TableCell>
              </TableRow>
            ) : (
              players.map((player) => (
                <TableRow key={player._id} hover>
                  <TableCell>{player.Rank}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{player.Name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={player.OVR} 
                      color={parseInt(player.OVR) >= 85 ? "success" : "primary"}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>{player.Position}</TableCell>
                  <TableCell>{player.Team}</TableCell>
                  <TableCell>{player.Nation}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="info"
                      onClick={() => handleOpenDetails(player)}
                      title="View Details"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenModal(player)}
                      title="Edit Player"
                    >
                      <EditIcon />
                    </IconButton>
                    {user?.role === 'admin' && (
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => setDeleteId(player._id)}
                        title="Delete Player"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Modal */}
      <PlayerModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        player={editingPlayer}
        onSubmit={handleModalSubmit}
        loading={loading}
      />

      {/* Player Details Modal */}
      <PlayerDetailsModal
        open={isDetailsOpen}
        handleClose={handleCloseDetails}
        player={viewingPlayer}
      />

      {/* Advanced Filters Modal */}
      <FilterModal
        open={isFilterOpen}
        handleClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete this player? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlayersList;
