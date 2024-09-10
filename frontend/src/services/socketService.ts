import {authService} from "./authService";
// import {w3cwebsocket as W3cWebsocket} from 'websocket'
import {socketBaseUrl} from "../constants/urls";

const socketService = async () => {
    const {data: {token}} = await authService.getSocketToken();
    return {
        // chat: (room) => new W3cWebsocket(`${socketBaseUrl}/chat/${room}/?token=${token}`),
        // cars: () => new W3cWebsocket(`${socketBaseUrl}/cars/?token=${token}`)
    }
}

export {
    socketService
}