import React, { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from "@chakra-ui/react";

const Settings = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "alexarawles@gmail.com",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <Box bg="gray.50" minHeight="100vh">
      {/* Banner */}
      <Box
        bgGradient="linear(to-r, blue.200, purple.200)"
        h="180px"
        borderRadius="0 0 2xl 2xl"
        mb={8}
      />

      <Box
        maxW="900px"
        mx="auto"
        bg="white"
        borderRadius="lg"
        shadow="lg"
        p={6}
      >
        <Flex alignItems="center" mb={8}>
          <Avatar size="xl" src="https://bit.ly/dan-abramov" />
          <Box ml={6}>
            <Heading as="h2" size="lg" fontWeight="bold">
              Alexa Rawles
            </Heading>
            <Text fontSize="md" color="gray.500">
              alexarawles@gmail.com
            </Text>
          </Box>
        </Flex>

        {/* Tabs for My Details and Password */}
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList>
            <Tab>My details</Tab>
            <Tab>Password</Tab>
          </TabList>

          <TabPanels mt={4}>
            {/* My Details Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Flex>
                  <FormControl mr={4}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="firstName"
                      placeholder="Your First Name"
                      value={user.firstName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="lastName"
                      placeholder="Your Second Name"
                      value={user.lastName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Flex>

                <Flex>
                  <FormControl mr={4}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phoneNumber"
                      placeholder="+84 399 997 857"
                      value={user.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Input
                      name="address"
                      placeholder="Your Address"
                      value={user.address}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Flex>

                <FormControl>
                  <FormLabel>My email Address</FormLabel>
                  <Input name="email" value={user.email} isDisabled />
                </FormControl>

                <Button colorScheme="blue" size="lg" alignSelf="flex-end">
                  Save
                </Button>
              </VStack>
            </TabPanel>

            {/* Password Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>Old Password</FormLabel>
                  <Input
                    name="oldPassword"
                    type="password"
                    placeholder="Your Old Password"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    name="newPassword"
                    type="password"
                    placeholder="Your New Password"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                  />
                </FormControl>

                <Button colorScheme="blue" size="lg" alignSelf="flex-end">
                  Save
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default Settings;
