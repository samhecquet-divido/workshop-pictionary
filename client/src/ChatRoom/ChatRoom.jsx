import React, { useEffect, useState } from "react";

import "./ChatRoom.css";
import useChat from "../useChat";
import useSocket from "../useSocket";
import Board from "./Board";

const ChatRoom = (props) => {
  const { roomId } = props.match.params;
  const { messages, sendMessage } = useChat(`room_${roomId}`);
  const [newMessage, setNewMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const { data: goodSolution, sendEvent: sendGoodSolutionEvent } = useSocket(
    "send_good_solution",
    "receive_good_solution"
  );
  const { data: gameStartedConfirmed, sendEvent: sendGameStartedConfirmed } =
    useSocket("send_game_started", "receive_game_started");

  useEffect(() => {
    if (goodSolution?.body?.success) {
      alert("youpi");
      setGameStarted(false);
      setGameRunning(false);
    }
  }, [goodSolution]);

  useEffect(() => {
    if (gameStartedConfirmed?.body?.started) {
      setGameRunning(true);
    }
  }, [gameStartedConfirmed]);

  const handleStartGame = () => {
    setGameStarted(true);
    setIsOwner(true);
    sendGameStartedConfirmed({ started: true });
  };

  const handleSendGoodSolution = () => {
    sendGoodSolutionEvent({ success: true });
    setGameStarted(false);
    setGameRunning(false);
    setIsOwner(false);
  };

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage) sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="room">
      <div className="left">
        <h1>Room: {roomId}</h1>
        {gameStarted ? (
          <>
            <div>
              <h2>Game running...</h2>
              <b>Propositions:</b>
              <ul>
                {messages.map((message, i) => (
                  <li key={i} className="suggestions">
                    {message.body}
                  </li>
                ))}
              </ul>
            </div>
            <button className="good_solution" onClick={handleSendGoodSolution}>
              GOOD SOLUTION!!
            </button>
          </>
        ) : (
          !gameRunning && (
            <div className="overlay">
              <button onClick={handleStartGame}>START GAME</button>
            </div>
          )
        )}
        <div>
          {gameRunning ? (
            <>
              <h2>Game running...</h2>
              <b>Submit answer:</b>
              <br />
              <textarea
                value={newMessage}
                onChange={handleNewMessageChange}
                placeholder="Write message..."
                style={{
                  margin: "10px 0",
                  width: "200px",
                  height: "50px",
                }}
              />
              <br />
              <button
                className="send_solution"
                onClick={handleSendMessage}
                disabled={newMessage === ""}
              >
                Send proposition
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="board">
        <Board isOwner={isOwner} gameRunning={gameStarted || gameRunning} />
      </div>
    </div>
  );
};

export default ChatRoom;
