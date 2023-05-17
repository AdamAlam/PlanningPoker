import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import UserTable from "./components/UserTable/UserTable";
import { Button } from "@chakra-ui/react";
import { users } from "./dummyData";
import EstimationCards from "./components/EstimationCards/EstimationCards";

const socket = io("http://localhost:8080");

const App = () => {
  const sendMessage = () => {
    socket.emit("sent_message", { message: "hello" });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => alert(data.message));
  }, [socket]);

  const [selectedPoints, setSelectedPoints] = useState<number | string>(0);
  const [pointsShown, setPointsShown] = useState<boolean>(false);

  return (
    <div>
      <EstimationCards changeValue={setSelectedPoints} />
      <UserTable
        pointsShown={pointsShown}
        userData={[...users, { name: "dynamic", points: selectedPoints }]}
      />
      <Button onClick={() => setPointsShown(!pointsShown)}>
        {pointsShown ? "Hide Points" : "Show Points"}
      </Button>
      <Button onClick={sendMessage}>Send Hello</Button>
    </div>
  );
};

export default App;
