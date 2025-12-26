import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "./routes";
import QueryProvider from "./context/query-provider";
import { AuthProvider } from "./context/auth-provider";
import { ConfirmDialogProvider } from "./components/confirm-dialog";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ConfirmDialogProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </ConfirmDialogProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
