import {io} from "socket.io-client"


export const ws = io("gamblingwebsite:5000", {
    cors: {
        origin: "*", //your own :port or a "*" for all origins
    }})