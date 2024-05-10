"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const ChatApp = () => {
    const [socket, setSocket] = useState<any>(null);
    const [message, setMessage] = useState<any>("");
    const [receivedMessage, setReceivedMessage] = useState<any>("");

    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io("ws://localhost:42069/api/en/conversations/chat/-42069", {
            extraHeaders: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTHVyYSBHdWVycmVybyIsInJvbGUiOiJjdXN0b21lciIsImN1c3RvbWVyX2lkIjoxNSwic3ViIjoiMzUiLCJleHAiOjE3MTcwODkyODl9.Haec5jSpi6gSyRJG0ohblsS0GnahEfn8XOBfg7jY9gw",
            },
        });
        setSocket(newSocket as any);

        // Cleanup function
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            // Listen for incoming messages
            socket.on("message", (data: any) => {
                setReceivedMessage(data);
            });
        }
    }, [socket]);

    const sendMessage = () => {
        if (socket && message.trim() !== "") {
            socket.emit("message", message);
            setMessage("");
        }
    };

    return (
        <div>
            <h1>Chat App</h1>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>Received: {receivedMessage}</div>
        </div>
    );
};

export default ChatApp;
