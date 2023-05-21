import {
  Box,
  Button,
  ButtonGroup,
  Fade,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import _ from "lodash";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./App.css";
import EstimationCards from "./components/EstimationCards/EstimationCards";
import Footer from "./components/Footer/Footer";
import NameChangeModal from "./components/NameChangeModal/NameChangeModal";
import PieChart from "./components/PieChart/PieChart";
import UserTable from "./components/UserTable/UserTable";

const App = () => {
  const socketRef = useRef<Socket | null>(null);
  const toast = useToast();
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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const [userDataSummary, setUserDataSummary] = useState<{
    mean: number;
    mode: number | undefined;
    median: number;
    valid: boolean;
  }>({ mean: 0, mode: 0, median: 0, valid: false });

  useEffect(() => {
    const points: Array<number | undefined> = userData
      .map((value) => {
        if (value.points && typeof value.points === "number") {
          return value.points;
        }
      })
      .filter((point) => point !== undefined && point != 0);

    const findMode = (
      numbers: Array<number | undefined>
    ): number | undefined => {
      if (numbers.length === 0) return undefined;

      const counts = _.countBy(numbers);
      const mostFrequent = _.maxBy(Object.keys(counts), (key) => counts[key]);

      return mostFrequent !== undefined ? Number(mostFrequent) : undefined;
    };

    const mean = _.round(_.mean(points), 2);
    const mode = findMode(points);

    setUserDataSummary({
      mean: mean,
      mode: mode,
      median: 0,
      valid: !!(mean && mode),
    });
  }, [userData]);

  const handleLogout = () => {
    setIsRegistered(false);
    sessionStorage.removeItem("userName");
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:8080");

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

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

      socketRef.current.on("cleared_data", (name) =>
        toast({
          title: `Points have been cleared by ${name}.`,
          status: "success",
          duration: 6000,
          isClosable: true,
        })
      );
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("change_all_points_visibility");
        socketRef.current.off("receive_user_data_change");
        socketRef.current.off("receive_points_visibility");
        socketRef.current.off("cleared_data");
      }
    };
  }, []);

  const changeDisplayName = (newName: string) => {
    if (socketRef.current) {
      socketRef.current.emit("change_display_name", newName);
      document.title = `Planning Poker - ${newName}`;
      sessionStorage.setItem("userName", newName);
    }
  };

  const clearPoints = () => {
    if (socketRef.current) {
      socketRef.current.emit("clear_points");
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password === "asgaev") {
      setIsRegistered(true);

      sessionStorage.setItem("userName", userName);
      document.title = `Planning Poker - ${userName}`;

      if (socketRef.current) {
        socketRef.current.emit("register", userName);
        socketRef.current.emit("readyForUpdates");
      }
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
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box
        p={4}
        alignItems="center"
        justifyContent="center"
        width="60%"
        mx="auto"
        flex="1 0 auto"
      >
        {isRegistered ? (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="4xl">Welcome, {userName}!</Text>
              <ButtonGroup>
                <Button onClick={() => setModalOpen(true)}>
                  Edit Display Name
                </Button>
                <Button colorScheme="red" onClick={handleLogout}>
                  Logout
                </Button>
              </ButtonGroup>
            </Box>
            <NameChangeModal
              modalIsOpen={modalOpen}
              setModalClose={setModalOpen}
              sendNewName={setUserName}
              emitData={changeDisplayName}
              oldName={userName}
            />
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minWidth="400px"
              minHeight="400px"
              height="20%"
              mx="auto"
              my="auto"
            >
              {pointsShown ? (
                <Fade in={pointsShown}>
                  <PieChart userData={userData} />
                  {userDataSummary.valid && (
                    <Text pt={10} fontSize="3xl">
                      Mean: {userDataSummary.mean}
                      {" | "}Mode:
                      {userDataSummary.mode}
                    </Text>
                  )}
                </Fade>
              ) : (
                <>
                  <Image
                    src="/CardLoading.svg"
                    alt="points-hidden"
                    w="90%"
                    maxW="400px"
                  />
                </>
              )}
            </Box>
            <EstimationCards changeValue={setSelectedPoints} />
            <UserTable pointsShown={pointsShown} userData={userData} />
            <Box py={4} m="0 auto" textAlign="left">
              <Button
                onClick={() => {
                  const newVal = !pointsShown;
                  setPointsShown(newVal);
                  sendPointsVisibilityChange(newVal);
                }}
                my={2}
              >
                {pointsShown ? "Hide Points" : "Show Points"}
              </Button>
              <Button onClick={clearPoints} m={2}>
                Clear All Points
              </Button>
            </Box>{" "}
          </>
        ) : (
          <Box width="100%" my="50%">
            <form onSubmit={handleSubmit}>
              <Box marginBottom="1rem">
                <label>
                  Please enter your name:
                  <Input
                    onChange={handleNameChange}
                    placeholder="Enter your name"
                    required
                  />
                </label>
              </Box>
              <Box marginBottom="1rem">
                <label>
                  Please Enter the Password:
                  <Input
                    onChange={handlePasswordChange}
                    placeholder="Enter Password"
                    required
                    type="password"
                  />
                </label>
              </Box>
              <Button type="submit" width="100%">
                Submit
              </Button>
            </form>
          </Box>
        )}
      </Box>
      <Box
        position="relative"
        width="100%"
        display={{ base: "none", md: "block" }}
        flexShrink={0}
      >
        <Footer />
      </Box>
    </Box>
  );
};

export default App;
