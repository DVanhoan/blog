require('./bootstrap');
import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './pages/Root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthProvider } from "./context/AuthContext";
import  "../css/app.css";



const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        },
    },
});


ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Root />
            </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
);
