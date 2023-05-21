import { Box, Link, Icon } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <Box as="footer" textAlign="center" py={4} bg="gray.200">
      Designed and developed by{" "}
      <Link href="https://github.com/adamalam" fontWeight={500}>
        Adam Alam
      </Link>{" "}
      <Link href="https://github.com/AdamAlam/PlanningPoker" isExternal>
        <Icon as={FaGithub} mb="-1px" ml="8px" />
      </Link>
    </Box>
  );
};
export default Footer;
