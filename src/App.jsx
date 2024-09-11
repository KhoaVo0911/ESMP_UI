import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./routes"; // Import your routes
import theme from "./theme/theme"; // Import the custom Chakra UI theme you shared

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        {/* Thay exitBeforeEnter bằng mode="wait" */}
        <AnimatePresence mode="wait">
          <Box>
            <AppRoutes />
          </Box>
        </AnimatePresence>
      </Router>
    </ChakraProvider>
  );
}

export default App;
