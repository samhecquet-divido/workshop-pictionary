import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";
import useSocket from "../useSocket";

const Home = () => {
  const [roomName, setRoomName] = React.useState("");
  const { data, sendEvent } = useSocket("get_rooms", "receive_rooms");

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };
  const handleGetRooms = () => {
    sendEvent();
  };

  return (
    <div className="home-container">
      <h1>Pictionary</h1>
      <input
        type="text"
        placeholder="room_"
        value={roomName}
        className="text-input-field"
        onChange={handleRoomNameChange}
      />
      <Link to={`/${roomName}`}>
        <button className="enter-room-button" disabled={roomName === ""}>
          Create or join a room
        </button>
      </Link>
      <br />

      <div>
        <h2>Active rooms</h2>
        {data.length === 0 && (
          <button className="get-rooms-button" onClick={handleGetRooms}>
            Get rooms list
          </button>
        )}

        <div>
          <ol>
            {data.map((room, i) => (
              <Link key={i} to={`/${room.slice(5)}`}>
                <li>{room.slice(5)}</li>
              </Link>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Home;
