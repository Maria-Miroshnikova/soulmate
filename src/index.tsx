import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {setupStore, STORE} from "./store/store";
import {Provider} from "react-redux";
import {ThemeProvider} from "@mui/material";
import {themeMain} from "./theme";
import AuthPage from "./components/loginPage/authPage";
import RegistrPage from "./components/loginPage/registrPage";

//const store = setupStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={STORE}>
        <ThemeProvider theme={themeMain}>
            <BrowserRouter>
                <React.StrictMode>
                    <RegistrPage />
                </React.StrictMode>
            </BrowserRouter>
        </ThemeProvider>
    </Provider>,
);
