import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import EstimationCards from "./components/EstimationCards/EstimationCards";
import UserTable from "./components/UserTable/UserTable";
import axios from "axios";

const socket = io("http://localhost:8080");

const App = () => {
  const [userName, setUserName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [selectedPoints, setSelectedPoints] = useState<number | string>(0);
  const [pointsShown, setPointsShown] = useState<boolean>(false);
  const [userData, setUserData] = useState<
    {
      name: string;
      points?: string | number;
    }[]
  >([]);

  useEffect(() => {
    socket.on("receive_user_data_change", (data) => {
      console.log(`Received user data`, data);
      setUserData(data);
    });

    socket.on("change_all_points_visibility", (data) =>
      setPointsShown(data.pointsShown)
    );

    return () => {
      socket.off("change_all_points_visibility");
      socket.off("receive_user_data_change");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("sent_message", {
      message: `The selected points on the other app is ${selectedPoints}`,
    });
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsRegistered(true);
    socket.emit("register", userName);
    socket.emit("readyForUpdates");
  };

  const sendPointsVisibilityChange = (newVisibility: boolean) => {
    socket.emit("change_points_shown", { pointsShown: newVisibility });
  };

  useEffect(() => {
    if (isRegistered && userName.length > 0) {
      socket.emit("send_points_change", selectedPoints);
    }
  }, [selectedPoints]);

  return (
    <>
      {isRegistered ? (
        <div>
          <h1>Welcome {userName}!</h1>
          <EstimationCards changeValue={setSelectedPoints} />
          <UserTable pointsShown={pointsShown} userData={userData} />
          <Button
            onClick={() => {
              const newVal = !pointsShown;
              setPointsShown(newVal);
              sendPointsVisibilityChange(newVal);
            }}
          >
            {pointsShown ? "Hide Points" : "Show Points"}
          </Button>
          <Button onClick={sendMessage}>Send Hello</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Please enter your name:
            <input
              type="text"
              value={userName}
              onChange={handleNameChange}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
};

export default App;
