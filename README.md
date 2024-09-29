# User presence tracking

https://github.com/user-attachments/assets/c21c353e-5b60-407f-bf98-07e678d80e9d


## Server
 - Node JS express server
 - Redis for persistable, queryable key value store to track online users

## Client
 - Basic angular implementation to connect and track users

## Transport
 - Socket.io for client-server communication

## How to run
 - `cd server && docker-compose up`
 - `cd client && npm install && npm start`
