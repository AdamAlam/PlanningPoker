import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import "./EstimationCards.css";

interface Props {
  changeValue: (newValue: number | string) => void;
}
const EstimationCards = ({ changeValue }: Props) => {
  const possibleValues: Array<number | string> = [
    0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100,
  ];
  return (
    <SimpleGrid
      spacing={4}
      templateColumns={"repeat(auto-fill, minmax(200px, 1fr))"}
    >
      {possibleValues.map((value) => (
        <Card onClick={() => changeValue(value)} className={"point-card"}>
          <CardBody textAlign={"center"}>
            <Text fontSize={"6xl"}>{value}</Text>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};
export default EstimationCards;
