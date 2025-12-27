import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "./routes";
import QueryProvider from "./context/query-provider";
import { AuthProvider } from "./context/auth-provider";
import { ThemeProvider } from "./context/theme-provider";
import { ConfirmDialogProvider } from "./components/confirm-dialog";
import { SocketProvider } from "./context/socket-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="workpulse-theme">
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>
            <ConfirmDialogProvider>
              <RouterProvider router={router} />
              <Toaster richColors position="top-right" />
            </ConfirmDialogProvider>
          </SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
