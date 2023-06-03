import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {useCookies} from "react-cookie";

const useSocketIO = () => {
    const socketRef = useRef();
    const [cookies, removeCookie] = useCookies(['Authorization']);
    const sendMessage = (messageType,requestBody) => {
        console.log('sendMessage')
        //if null, connect it
        if (!socketRef.current||!socketRef.current.connected) {
            socketRef.current = io(
                process.env.REACT_APP_WS_URL,
                {
                    transports: ['websocket'],
                    withCredentials: false,
                    query: { token: cookies.Authorization },
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionAttempts: 3,
                }
            );
        }
        socketRef.current.emit(messageType, requestBody);
    }

    useEffect(() => {
        console.log("useSocketIO called")
        // 创建socket连接
//        socketRef.current = io(process.env.REACT_APP_WS_URL,{withCredentials: false,  query: { token: cookies.Authorization }});
        if (!socketRef.current||!socketRef.current.connected) {
            socketRef.current = io(
                process.env.REACT_APP_WS_URL,
                {
                    transports: ['websocket'],
                    withCredentials: false,
                    query: { token: cookies.Authorization },
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionAttempts: 3,
                }
            );
        }

        socketRef.current.on('connect', () => {
            console.log('socket connected');
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Error connecting to socket:', error);
        });

        socketRef.current.on('reconnect', (attemptNumber) => {
            console.log(`socket reconnected after ${attemptNumber} attempts`);
        });

        socketRef.current.on('reconnect_error', (error) => {
            console.error('Error reconnecting to socket:', error);
        });

        socketRef.current.on('logout', function (data) {
            console.log('reply:loutout')
            removeCookie('Authorization');
            window.location.href = '/login';
        });


        // 设置心跳发送间隔为1分钟
        const heartbeat=setInterval(() => {
            if (!socketRef.current||!socketRef.current.connected) {
                socketRef.current = io(
                    process.env.REACT_APP_WS_URL,
                    {
                        transports: ['websocket'],
                        withCredentials: false,
                        query: { token: cookies.Authorization },
                        reconnection: true,
                        reconnectionDelay: 1000,
                        reconnectionAttempts: 3,
                    }
                );
            }
            if (socketRef.current.connected) {
                socketRef.current.emit('heartbeat', 'ping');
                console.log('ping');
            }
        }, 30000); // 60000ms => 1 minute

        // 清除操作
        return () => {
            console.log("useSocketIO return called")
            clearInterval(heartbeat);
            socketRef.current.disconnect();
        };
    }, [cookies]);

    return [socketRef,sendMessage];
};

export default useSocketIO;