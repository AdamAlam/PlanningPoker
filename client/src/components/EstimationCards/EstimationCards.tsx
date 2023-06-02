import { Box, Card, CardBody, Flex, Text } from "@chakra-ui/react";

import "./EstimationCards.css";

interface EstimationCardProps {
  changeValue: (newValue: number | string) => void;
  selectedValue: number;
}
const EstimationCards = ({
  changeValue,
  selectedValue,
}: EstimationCardProps) => {
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
          <Card
            className="point-card"
            bg={value === selectedValue ? "#ffcfd2" : "#ffffff"}
            border={
              value === selectedValue
                ? "2px solid #faaaaf"
                : "2px solid rgba(255,255,255, 0)"
            }
            _hover={{
              background: value === selectedValue ? "#faaaaf" : "#dbdbdb",
              cursor: "pointer",
            }}
          >
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
