import { Socket } from 'socket.io-client';

export default function Chat({ socket }: { socket: Socket }) {
  console.log(socket);
  return <div>Chat</div>;
}
