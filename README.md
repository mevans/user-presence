# User presence tracking

https://github.com/user-attachments/assets/c21c353e-5b60-407f-bf98-07e678d80e9d


## Server
 - Node JS express server
 - Redis for persistable, queryable key value store to track online users

## Client
 - Basic angular implementation to connect and track users

## Transport
 - Socket.io for client-server communication

## How does it work
 - Users can start watching the status of a user by joining a room, with the target user's id as the room name
 - Users connecting or disconnecting to the websocket server will send a status update to a room with their id
 - Redis is used to track the status of each user. Primarily used when a user joins a room, to get the current status of the user
 - The client will show the status of the user as online or offline based on the status updates received from the server

## How to run
 - `cd server && docker-compose up`
 - `cd client && npm install && npm start`
