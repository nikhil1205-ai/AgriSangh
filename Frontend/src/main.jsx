import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AlertProvider from "./components/alerts/AlertProvider";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </AuthProvider>
  </BrowserRouter>
)
