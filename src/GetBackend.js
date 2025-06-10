import {io} from "socket.io-client"


export const ws = io("https://gamblingwebsite.onrender.com", {
    cors: {
        origin: "*", //your own :port or a "*" for all origins
    }})