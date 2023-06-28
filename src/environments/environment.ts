
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';


const config: SocketIoConfig = { url: 'http://localhost:2000', options: {} };

export const environment ={

 
    production :true,
    socketConfig :config


};