import { Box, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" textAlign="center" py={4} bg="gray.200">
      Designed and developed by Adam Alam.{" "}
      <Link href="https://github.com/adamalam" isExternal>
        GitHub
      </Link>
    </Box>
  );
};
export default Footer;
