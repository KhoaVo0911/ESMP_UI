import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend"; // Giữ HTML5Backend
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./routes"; // Import routes của bạn
import theme from "./theme/theme"; // Import theme từ Chakra UI

function App() {
  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <AnimatePresence mode="wait">
            <Box>
              <AppRoutes />
            </Box>
          </AnimatePresence>
        </Router>
      </DndProvider>
    </ChakraProvider>
  );
}

export default App;
