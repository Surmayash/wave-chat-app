# Wave Chat Backend 
This is the backend server for the Wave Chat application, built with Node.js, Express, and Socket.io. It facilitates real-time messaging between users in a chat room.

## Features
- **Real-time Communication**: Uses `socket.io` for instant messaging.
- **Room Management**: Allows users to join specific chat rooms (max 2 users per room).
- **Message Logging**: Automatically logs all chat messages to a hidden `.build-cache` file in Base64 format.
- **Hot Reloading**: Configured with `nodemon` for efficient development.

## Prerequisites
- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

## Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Server

### Development Mode
To run the server with hot-reloading (restarts automatically on file changes):
```bash
npm start
```
The server runs on **port 3055** by default.

### Production Build
To compile the TypeScript code to JavaScript:
```bash
npm run build
```

## Project Structure

- **`server.ts`**: The main entry point of the application.
  - Initializes the Express app and HTTP server.
  - Sets up the Socket.io server with CORS enabled.
  - Implements the socket event listeners for connection, joining rooms, and sending messages.
- **`config.ts`**: Contains configuration settings (e.g., port number).
- **`.build-cache`**: A hidden file where chat messages are securely logged (Base64 encoded) for verification.
- **`package.json`**: Lists dependencies and scripts.

## Socket Events

### Client-to-Server

| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `join_chat` | `connectionId` (string) | Request to join a specific room. Succeeds only if room has < 2 users. |
| `send_message` | `{ connectionId, message }` | Sends a message to the specified room. Broadcasts to all users in the room. |

### Server-to-Client

| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `chat_start` | `null` | Sent to all users in a room when the second user joins (room is full). |
| `receive_message` | `{ sender, message }` | Sent to all users in a room when a new message is received. |
| `chat_end` | `null` | Sent to remaining users in a room if someone disconnects. |
| `error` | string | Sent if a user tries to join a full room. |

## Implementation Details

1.  **Server Initialization**: The `http` server wraps the Express app to allow Socket.io to attach to it.
2.  **CORS**: Cross-Origin Resource Sharing is enabled for `*` to allow connections from any frontend client.
3.  **Chat Logic**:
    - When a user joins, we check the room size using `io.sockets.adapter.rooms`.
    - If `usersInRoom < 2`, the user joins.
    - If `usersInRoom + 1 === 2`, `chat_start` is emitted.
4.  **Logging**: The `logSecretMessage` function appends every message to `.build-cache` encoded in Base64 `fs.appendFileSync`.

