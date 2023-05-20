import { Text } from "@chakra-ui/react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  userData: {
    name: string;
    points?: string | number;
  }[];
}
const PieChart = ({ userData }: Props) => {
  const pointsFrequency: { [key: string | number]: number } = {};

  userData.forEach((user) => {
    if (user.points) {
      if (Object.prototype.hasOwnProperty.call(pointsFrequency, user.points)) {
        pointsFrequency[user.points] += 1;
      } else {
        pointsFrequency[user.points] = 1;
      }
    }
  });

  const data = {
    labels: Object.keys(pointsFrequency),
    datasets: [
      {
        data: Object.values(pointsFrequency),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {Object.keys(pointsFrequency).length > 0 ? (
        <Pie data={data} />
      ) : (
        // TODO: Add some kind of animation here when no one has selected any data.
        <Text fontSize={"4xl"} m={"0 auto"} textAlign={"center"}>
          Awaiting Data...
        </Text>
      )}
    </>
  );
};
export default PieChart;
