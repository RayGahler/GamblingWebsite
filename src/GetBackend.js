import {io} from "socket.io-client"


export const ws = io("127.0.0.1:5000", {
    cors: {
        origin: "*", //your own :port or a "*" for all origins
    }})