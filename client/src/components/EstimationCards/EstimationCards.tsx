import { Box, Card, CardBody, Flex, Text } from "@chakra-ui/react";

import "./EstimationCards.css";

interface Props {
  changeValue: (newValue: number | string) => void;
}
const EstimationCards = ({ changeValue }: Props) => {
  const possibleValues: Array<number | string> = [
    0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100,
  ];
  return (
    <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
      {possibleValues.map((value) => (
        <Box
          minWidth="10vw"
          margin={2}
          onClick={() => changeValue(value)}
          key={value}
        >
          <Card className="point-card">
            <CardBody textAlign="center">
              <Text fontSize="4xl">{value}</Text>
            </CardBody>
          </Card>
        </Box>
      ))}
    </Flex>
  );
};
export default EstimationCards;
