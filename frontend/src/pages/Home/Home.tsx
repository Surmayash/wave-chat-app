import { Socket } from 'socket.io-client';

export default function Home({ socket }: { socket: Socket }) {
  console.log(socket);
  return <div>Home</div>;
}
