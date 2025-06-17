import { io } from "socket.io-client";

const SOCKET_IO_URL = "https://brainbuster-4543.onrender.com"; 

const socket = io(SOCKET_IO_URL, {
  autoConnect: false, 
  transports: ["websocket"], 
});

export default socket;