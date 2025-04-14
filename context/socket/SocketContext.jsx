// context/socket/SocketContext.tsx
import React, { createContext, useContext } from "react";
import { useSocketWithToken } from "@/hooks/socket/useSocketWithToken"; // Đã có
import { useSelector } from "react-redux"; // Nếu bạn dùng Redux

const SocketContext = createContext({
    socket: null,
    loading: true,
    error: null,
});

export const SocketProvider = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    const dataSetting = useSelector((state) => state.setings);

    const { socket, loading, error } = useSocketWithToken({ auth, dataSetting });

    return (
        <SocketContext.Provider value={{ socket, loading, error }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => useContext(SocketContext);
