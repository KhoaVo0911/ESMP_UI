import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./routes";
import theme from "./theme/theme";
import { AuthProvider } from "./shared/auth/AuthContext";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Box minH="100vh" bg="gray.50">
              <AppRoutes />
            </Box>
          </AnimatePresence>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
