import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import Auth from '../../utils/auth';
import socket from '../../socket';
import './Lobby.css'
const Lobby = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [gameFull, setGameFull] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [opponent, setOpponent] = useState(null);
  const [error, setError] = useState('');
  const [inviteReceived, setInviteReceived] = useState(false);
  const [invitingPlayer, setInvitingPlayer] = useState(null);
  const [inviteSent, setInviteSent] = useState(false)
  const {loading, data} = useQuery(GET_ME)
  const me = data?.me || {}
  
  useEffect(() => {
    
    if (!gameId) return;
    
    console.log('Lobby useEffect triggered with gameId:', gameId);
    if (me._id) {
      socket.emit('authenticated', me._id);
      console.log(`Emitted 'authenticated' with user ID: ${me._id}`);
    }
    
    const handleGameStarted = (gameData) => {
      console.log('Received gameStarted event with data:', gameData);
      
      setWaiting(false);
      setOpponent(gameData.opponentId);
      
      navigate(`/quiz/${gameId}`,{ 
        state: { 
          totalQuestions: gameData.totalQuestions,
        } 
      });
    };
    
    const handleOpponentLeft = () => {
      setOpponent(null);
      console.log('Opponent left game.')
    };
    console.log(socket)
    
    
    const handleGameInviteRecieved = (gameData) => {
      console.log('Game invite recieved:', gameData);
      setInviteReceived(true)
      setInvitingPlayer(gameData.senderName)
    }
    
    socket.on('gameInviteReceived', handleGameInviteRecieved);
    socket.on('gameStarted', handleGameStarted);
    socket.on('opponentLeft', handleOpponentLeft);
    
    return () => {
      socket.off('gameInviteReceived', handleGameInviteRecieved);
      socket.off('gameStarted', handleGameStarted);
      socket.off('opponentLeft', handleOpponentLeft);
    };
  }, [gameId, navigate, me._id]);
  const handleInvite = (friendId) => {
    const inviterId = me._id;
    socket.emit('gameInvite', {
      gameId,
      friendId,
      inviterId,
      senderName: `${Auth.getProfile().data.firstName} ${me.lastName}`
    })
    console.log('invite send', { gameId, friendId, inviterId })
    setInviteSent(true)
  }
  const handleAcceptInvite = () => {
    console.log(`Accepting invite from ${invitingPlayer}`);
    socket.emit('acceptGameInvite', {
      gameId,
      opponentId: invitingPlayer,
    })
  }
  console.log(data)
  
  const handleDeclineInvite = () => {
    console.log(`Declining invite from ${invitingPlayer}`) 
    setInviteReceived(false);
  }
  
  // console.log(me)
  
  if (loading){
    return <p>loading...</p>
  }
  
  return (
    <div className='lobby-container'>
      <div className='lobby-content'>
      <h2>BrainBuster Lobby</h2>
      <div className='game-info'>
        <p className='game-id'>
          Game ID: <strong>{gameId}</strong>
        </p>
        </div>
        {waiting ? (
          <p className='waiting-message'>Waiting for the game to start...</p>
        ) : (
          <p className='waiting-message'>Your opponent has joined. The game is starting...</p>
        )}
        {gameFull && <p className='error'>{error}</p>}
      </div>
      <div>
        {/* <h3>{invitingPlayer} has invited you to join their quiz!</h3>
        <button onClick={handleAcceptInvite}>Accept</button>
        <button onClick={handleDeclineInvite}>Decline</button> */}
      </div>
      <div className='friends-section'>
        <h3>Invite your Friends</h3>
        <div  style={{
          display: 'flex',
          flexDirection: 'column',
          width: '50%',
          // margin: '0 auto'
        }}>
        {me.friends ? (
            me.friends.map((friend) =>(
              <>
              {/* <li>{friend.firstName} {friend.lastName}</li> */}
            
              <button className='friend-item' onClick={() => handleInvite(friend._id)} key={friend._id} style={{
                margin: '10px'
              }}>Invite {friend.firstName} {friend.lastName} to this game!</button>
              </>
            
            ))
        ) : (
          <p>You have no friends to invite</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;