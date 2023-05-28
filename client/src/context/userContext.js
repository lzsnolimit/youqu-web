import { createContext } from 'react';

const UserContext = createContext({
    user: null,
    setUser: () => {console.log("setUser called")},
    socket: null,
});

export default UserContext;