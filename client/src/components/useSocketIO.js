import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {useCookies} from "react-cookie";

const useSocketIO = () => {
    const socketRef = useRef();
    const [cookies, removeCookie] = useCookies(['Authorization']);


    useEffect(() => {
        console.log("useSocketIO called")
        // 创建socket连接
        socketRef.current = io(process.env.REACT_APP_WS_URL,{withCredentials: false,  query: { token: cookies.Authorization }});


        socketRef.current.on('logout', function (data) {
            console.log('reply:loutout')
            removeCookie('Authorization');
            window.location.href = '/login';
        });


        // 设置心跳发送间隔为1分钟
        setInterval(() => {
            if (socketRef.current.connected) {
                socketRef.current.emit('heartbeat', 'ping');
            }
        }, 30000); // 60000ms => 1 minute

        // 清除操作
        return () => {
            clearInterval();
            socketRef.current.disconnect();
        };
    }, []);

    return socketRef;
};

export default useSocketIO;