import { Card, CardBody, SimpleGrid, Text } from "@chakra-ui/react";

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
      templateColumns={"repeat(auto-fill, minmax(10vw, 1fr))"}
    >
      {possibleValues.map((value) => (
        <Card
          onClick={() => changeValue(value)}
          className={"point-card"}
          key={value}
        >
          <CardBody textAlign={"center"}>
            <Text fontSize={"4xl"}>{value}</Text>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};
export default EstimationCards;
