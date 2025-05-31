import {io} from "socket.io-client"


export const ws = io("192.168.1.15:5000", {
    cors: {
        origin: "*", //your own :port or a "*" for all origins
    }})