import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ApiProvider } from './ApiContext'
import UserProvider from './UserContext'
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
            <UserProvider>
                <ApiProvider>

                    <App />
                </ApiProvider>
            </UserProvider>
    </React.StrictMode>
);
