import { useState, useEffect } from "react";
import logo from "../../assets/images/trans_bg.png";
import { Link as ScrollLink } from "react-scroll";
import { FaBars, FaXmark } from "react-icons/fa6";
import { Box, Flex, Text, Button, IconButton } from "@chakra-ui/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { label: "Home", path: "home" },
    { label: "About Us", path: "service" },
    { label: "Services", path: "about" },
    { label: "FAQ", path: "faq" },
  ];

  return (
    <Box
      as="header"
      bg="#f4f7fe"
      position="fixed"
      top="0"
      left="0"
      right="0"
      w="full"
      zIndex="999"
      boxShadow={isSticky ? "md" : "none"}
      transition="all 0.3s ease"
    >
      <Box as="nav" py="4" px={{ base: "4", lg: "14" }}>
        <Flex justify="space-between" align="center" gap="8">
          {/* Logo Section */}
          <Box as="a" href="#" display="flex" alignItems="center" fontSize="2xl" fontWeight="semibold">
            <img src={logo} alt="Logo" className="w-10" />
            <Text ml="3" fontSize={{ base: "lg", lg: "2xl" }}>ESMP</Text>
          </Box>

          {/* Desktop Menu */}
          <Box display={{ base: "none", md: "flex" }}>
  <Flex as="ul" gap="12">
    {navItems.map(({ label, path }) => (
      <ScrollLink
        key={label}
        to={path}
        spy={true}
        smooth={true}
        offset={-100}  // Adjust if needed
        className="block text-gray-900 hover:text-blue-500 cursor-pointer"
      >
        {label}
      </ScrollLink>
    ))}
  </Flex>
</Box>


          {/* Desktop Button Section */}
          <Box display={{ base: "none", lg: "flex" }} alignItems="center" gap="8">
            <Button as="a" href="/login" variant="link" color="gray.900" _hover={{ color: "#457b9d" }}>
              Login
            </Button>
            {/* <Button bg="blue.500" color="white" py="2" px="4" _hover={{ bg: "gray.800" }}>
              Sign Up
            </Button> */}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: "block", md: "none" }}
            aria-label="Toggle Menu"
            icon={isMenuOpen ? <FaXmark /> : <FaBars />}
            onClick={toggleMenu}
            color="gray.900"
            variant="ghost"
            _focus={{ boxShadow: "none" }}
          />
        </Flex>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <Box
            display={{ base: "block", md: "none" }}
            position="fixed"
            top="0"
            right="0"
            left="0"
            mt="16"
            bg="#457b9d"
            p="7"
            zIndex="1000"
          >
            <Flex direction="column" gap="4">
              {navItems.map(({ label, path }) => (
                <ScrollLink
                  key={label}
                  to={path}
                  spy={true}
                  smooth={true}
                  offset={-90}
                  onClick={toggleMenu}
                  className="block text-white hover:text-gray-500"
                >
                  {label}
                </ScrollLink>
              ))}
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
