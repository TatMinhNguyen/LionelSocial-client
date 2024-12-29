import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:8000";
// console.log(SOCKET_URL)

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;
