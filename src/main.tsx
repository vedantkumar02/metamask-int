import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { MetaMaskConnect } from "./metamask-connect";
import { ThemeProvider } from "./context/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <MetaMaskConnect />
    </ThemeProvider>
    <Toaster
      position="top-right"
      reverseOrder
      toastOptions={{
        style: {
          fontSize: "14px",
        },
      }}
    />
  </StrictMode>
);
