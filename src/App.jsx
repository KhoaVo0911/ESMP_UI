import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
          <DndProvider backend={HTML5Backend}>
            <AnimatePresence mode="wait">
              <Box>
                <AppRoutes />
              </Box>
            </AnimatePresence>
          </DndProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
