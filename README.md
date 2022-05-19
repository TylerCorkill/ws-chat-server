# WebSocket Chat Server
Chat server built to explore WebSockets and their applications. 
No tests were written because I have no intention to continue iterating on this project.

The server itself is a channel based chat, with channel ids defined by the url path. For example, any user connecting to `localhost:6000/fishing` would be placed in the `fishing` channel.

## Setup

First, create a `.env` file from the example file and give the environment variables values.

Install dependencies:
```shell
npm i
```

Start dev server:
```shell
npm start
```

Most browsers require SSL for WebSocket connections, so you might need to deploy the server to test it. Although tools like postman can be used to test the server locally.
  
To build a production ready server run:
```shell
npm run prod
```

## Message Specification
### Connection
Server only:
```json
{
  "type": "connection",
  "id": "fishing"
}
```
Sends connection information to the client after successfully connecting to a channel.

### Heartbeat
Server initiated with client pingback.  

Server:
```json
{
  "type": "heartbeat",
  "authenticated": "true"
}
```

Client:
```json
{
  "type": "heartbeat"
}
```
Server pings a client with authenticated information until that client has disconnected. Client is expected to respond to every ping, if it doesn't the server will unauthenticate the connection.

### Identity
Client initiated with server success response.  

Client:
```json
{
  "type": "identity",
  "user": "fishing_beast_5000"
}
```

Server:
```json
{
  "type": "identity",
  "success": "true"
}
```
Client requests usage of a username in a channel. If that username is already taken the server responds false, if not the server responds true and authenticates the connection.

### Message
Client initiated with server dispatching message to all connections  

Client:
```json
{
  "type": "message",
  "text": "I heard you have the best luck fishing in the morning"
}
```

Server:
```json
{
  "type": "message",
  "text": "I heard you have the best luck fishing in the morning",
  "timestamp": 1652997756,
  "user": "fishing_beast_5000"
}
```

Client sends a message to the server. The server then decorates the message with the user's name and a timestamp, and sends the message to all connections (including the sender).