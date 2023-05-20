import { Button, Input } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./App.css";
import EstimationCards from "./components/EstimationCards/EstimationCards";
import UserTable from "./components/UserTable/UserTable";

const App = () => {
  const socketRef = useRef<Socket | null>(null);
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
    socketRef.current = io("http://localhost:8080");

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Check session storage for a stored name when the app loads
  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
      document.title = `Planning Poker - ${storedName}`;
      setIsRegistered(true);
      if (socketRef.current) {
        socketRef.current.emit("register", storedName);
        socketRef.current.emit("readyForUpdates");
      }
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("receive_user_data_change", (data) => {
        setUserData(data);
      });

      socketRef.current.on("receive_points_visibility", (data) => {
        setPointsShown(data);
      });

      socketRef.current.on("change_all_points_visibility", (data) =>
        setPointsShown(data.pointsShown)
      );
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("change_all_points_visibility");
        socketRef.current.off("receive_user_data_change");
        socketRef.current.off("receive_points_visibility");
      }
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current) {
      socketRef.current.emit("sent_message", {
        message: `The selected points on the other app is ${selectedPoints}`,
      });
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsRegistered(true);

    sessionStorage.setItem("userName", userName);
    document.title = `Planning Poker - ${userName}`;

    if (socketRef.current) {
      socketRef.current.emit("register", userName);
      socketRef.current.emit("readyForUpdates");
    }
  };

  const sendPointsVisibilityChange = (newVisibility: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit("change_points_shown", {
        pointsShown: newVisibility,
      });
    }
  };

  useEffect(() => {
    if (isRegistered && userName.length > 0 && socketRef.current) {
      socketRef.current.emit("send_points_change", selectedPoints);
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
            <Input
              onChange={handleNameChange}
              placeholder="Enter your name"
              required
            />
          </label>
          {/* //TODO: Change this to a Chakra Button */}
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
};

export default App;
