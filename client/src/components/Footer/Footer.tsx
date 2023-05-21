import { Box, Link, Icon } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <Box as="footer" textAlign="center" py={4} bg="gray.200">
      Designed and developed by Adam Alam.{" "}
      <Link href="https://github.com/adamalam" isExternal>
        <Icon as={FaGithub} />
      </Link>
    </Box>
  );
};
export default Footer;
