import {
  Box,
  Button,
  ButtonGroup,
  Fade,
  Heading,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import _ from "lodash";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./App.css";
import cardLoading from "./assets/CardLoading.svg";
import EstimationCards from "./components/EstimationCards/EstimationCards";
import Footer from "./components/Footer/Footer";
import NameChangeModal from "./components/NameChangeModal/NameChangeModal";
import PieChart from "./components/PieChart/PieChart";
import UserTable from "./components/UserTable/UserTable";
import { UserDataSummary, UserData } from "./CommonTypes";
import { defaultUserData } from "./CommonDefaults";

const App = () => {
  const socketRef = useRef<Socket | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [selectedPoints, setSelectedPoints] = useState<number | string>(0);
  const [pointsShown, setPointsShown] = useState<boolean>(false);
  const [userData, setUserData] = useState<Array<UserData>>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [userDataSummary, setUserDataSummary] =
    useState<UserDataSummary>(defaultUserData);

  const toast = useToast();

  /** WIP: Calculates Data Summary on {@link userData} change */
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

  /** Handles connection and disconnection from socket */
  useEffect(() => {
    socketRef.current = io(
      `${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}`,
      { secure: true, rejectUnauthorized: false }
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  /** Checks if user has been registered to bypass registratiom */
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

  /**
   * Socket listeners
   *
   * Receives change in user data
   * Receives points visibility status
   * Receives change in points visibility
   * Receives data clear
   */
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

    /** Turns off listeners */
    return () => {
      if (socketRef.current) {
        socketRef.current.off("change_all_points_visibility");
        socketRef.current.off("receive_user_data_change");
        socketRef.current.off("receive_points_visibility");
        socketRef.current.off("cleared_data");
      }
    };
  }, []);

  /** Sends info to backend when the client's selected points change */
  useEffect(() => {
    if (isRegistered && userName.length > 0 && socketRef.current) {
      socketRef.current.emit("send_points_change", selectedPoints);
    }
  }, [selectedPoints]);

  /** Client display name change handler
   *
   * Sends command to backend to change display name of current user
   * Changes name in session storage
   * Changes document title to display name
   */
  const changeDisplayName = (newName: string) => {
    if (socketRef.current) {
      socketRef.current.emit("change_display_name", newName);
      document.title = `Planning Poker - ${newName}`;
      sessionStorage.setItem("userName", newName);
    }
  };

  /** Clear points for all users handler
   *
   * Sends command to backend to clear all points for all users
   */
  const clearPoints = () => {
    if (socketRef.current) {
      socketRef.current.emit("clear_points");
    }
  };

  /** Client input name change handler */
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  /** Client input password change handler */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /** Submit handler for registration/login
   *
   * Sends command to backend to add new user
   * Sends command to backend to allow new data
   */
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // * * You do not need to tell me that this is insecure. I am aware 😂
    // * * The repo is public so anyone can see this if they look for it
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

  /** Points visibility change handler
   *
   * Sends command to backend to change points visibility for
   *  all users
   */
  const sendPointsVisibilityChange = (newVisibility: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit("change_points_shown", {
        pointsShown: newVisibility,
      });
    }
  };

  /** Logout handler
   *
   * Deletes username from session storage
   */
  const handleLogout = () => {
    setIsRegistered(false);
    sessionStorage.removeItem("userName");
  };

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
                    src={cardLoading}
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
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="20px"
          >
            <Heading mb="2rem">Planning Poker Login</Heading>
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
                  Please enter the password:
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
