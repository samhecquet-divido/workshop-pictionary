import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:4000";

const useSocket = (eventEmiter, eventReceiver) => {
  const [data, setData] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {});

    socketRef.current.on(eventReceiver, (responseData) => {
      console.log({ eventReceiver, responseData });
      setData(responseData);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [eventReceiver]);

  const sendEvent = (messageBody = {}) => {
    console.log(`send ${messageBody}`);
    socketRef.current.emit(eventEmiter, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { data, sendEvent };
};

export default useSocket;
