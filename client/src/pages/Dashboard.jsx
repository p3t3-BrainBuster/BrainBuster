import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ME, QUERY_USERS } from '../utils/queries';
import socket from '../socket';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext.jsx';
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // State management
  const [authenticated, setAuthenticated] = useState(false);
  const [gameId, setGameId] = useState('');
  const [inviteReceived, setInviteReceived] = useState(false);
  const [invitingPlayer, setInvitingPlayer] = useState(null);
  const [inviteName, setInviteName] = useState(null);
  const [error, setError] = useState(null);

  const gameIdRef = useRef('');

  // Apollo queries
  const { loading, error: queryError, data } = useQuery(GET_ME);
  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(QUERY_USERS);

  const me = data?.me || {};
  const topThreePlayers = dataUsers?.users?.slice(0, 3) || [];

  useEffect(() => {
    // Ensure socket connection
    if (!socket.connected) {
      socket.connect();
    }

    // Authenticate the user with the server
    if (me._id && !authenticated) {
      socket.emit('authenticated', me._id);
      setAuthenticated(true);
      console.log(`Authenticated with user ID: ${me._id}`);
    }

    // Socket event listeners
    const handleInviteReceived = ({ gameId, inviterId, senderName }) => {
      setInviteReceived(true);
      setGameId(gameId);
      setInvitingPlayer(inviterId);
      setInviteName(senderName);
      gameIdRef.current = gameId;
      console.log('Game invite received:', { gameId, inviterId, senderName });
    };

    const handleGameStarted = (gameData) => {
      console.log('Game started:', gameData);
      navigate(`/quiz/${gameData.gameId}`, {
        state: { totalQuestions: gameData.totalQuestions },
      });
    };

    const handleGameJoined = () => {
      console.log('Game joined successfully.');
      navigate(`/lobby/${gameIdRef.current}`);
    };

    const handleGameNotFound = () => {
      setError('Game not found.');
    };

    const handleGameFull = () => {
      setError('Game is full.');
    };

    socket.on('gameInviteReceived', handleInviteReceived);
    socket.on('gameStarted', handleGameStarted);
    socket.on('gameJoined', handleGameJoined);
    socket.on('gameNotFound', handleGameNotFound);
    socket.on('gameFull', handleGameFull);

    return () => {
      // Clean up socket listeners
      socket.off('gameInviteReceived', handleInviteReceived);
      socket.off('gameStarted', handleGameStarted);
      socket.off('gameJoined', handleGameJoined);
      socket.off('gameNotFound', handleGameNotFound);
      socket.off('gameFull', handleGameFull);
    };
  }, [me._id, authenticated, navigate]);

  const handleJoinGame = () => {
    if (!gameId.trim()) {
      setError('Please enter a valid Game ID.');
      return;
    }

    setError(null);
    gameIdRef.current = gameId;

    console.log('Joining game with ID:', gameId);
    socket.emit('joinGame', { gameId });
  };

  const handleCreateGame = () => {
    navigate('/create-game');
  };

  // Redirect if avatar is missing
  useEffect(() => {
    if (!loading && me && !me.avatar) {
      navigate('/avatars');
    }
  }, [me, loading, navigate]);

  if (loading || loadingUsers) return <p>Loading...</p>;
  if (queryError || errorUsers) return <p>Error loading data.</p>;

  return (
    <div className='dash' style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main content */}
      <div
        className="dashboard-container"
        style={{
          backgroundColor: theme.colors.background,
          flex: 1,
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: '2rem',
          marginTop: '64px', // Adjusted for navbar height
        }}
      >
        {/* Sidebar */}
        <div
          className="sidebar"
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            height: 'fit-content',
          }}
        >
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#F5F5F5',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              <img src={me.avatar?.src} alt="User Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            </div>
            <h3 style={{ color: '#7E57C2', marginBottom: '0.5rem' }}>
              {me.firstName} {me.lastName}
            </h3>
            <p style={{ color: '#616161' }}>Rank: #{topThreePlayers.findIndex((user) => user._id === me._id) + 1}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              to="/avatars"
              style={{
                color: '#7E57C2',
                textDecoration: 'none',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <span>🧑</span>
              <span>Customize Avatar</span>
            </Link>
            {/* <Link
              to="/themes"
              style={{
                color: '#7E57C2',
                textDecoration: 'none',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <span>🎨</span>
              <span>Themes</span>
            </Link> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Game Section */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {inviteName ? (
              <>
                <h2 style={{ color: '#7E57C2', marginBottom: '1.5rem' }}>{inviteName} has invited you to a game!</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleJoinGame}
                    style={{
                      backgroundColor: '#FF4081',
                      color: '#FFFFFF',
                      padding: '1rem 2rem',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      flex: '1',
                      maxWidth: '200px',
                    }}
                  >
                    Join Game!
                  </button>
                </div>
              </>
            ) : (
              <h2>You have no Game Invites</h2>
            )}
          </div>

          {/* Stats Section */}
          <div style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#7E57C2', marginBottom: '1.5rem' }}>Top Players</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {topThreePlayers.map((player, index) => (
                <div key={index} style={{ 
                  backgroundColor: '#F5F5F5',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FF4081',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <p style={{ color: '#7E57C2', fontWeight: '500' }}>{player.firstName} {player.lastName}</p>
                    <p style={{ color: '#616161' }}>Games Won: {player.stats.gamesWon}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Section */}
          <div style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#7E57C2', marginBottom: '1.5rem' }}>Recent Achievements</h2>
            <div style={{ 
              backgroundColor: '#F5F5F5',
              padding: '1.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ 
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#7E57C2',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🏆
              </div>
              <div>
                <h3 style={{ color: '#7E57C2', marginBottom: '0.5rem' }}>Avatar Upgrade</h3>
                <p style={{ color: '#616161' }}>Unlocked by Winning 5 Games</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Dashboard;