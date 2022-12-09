import { createTheme } from '@mui/material/styles';

export const themeMain = createTheme({
    palette: {
        primary: {
            main: '#c7bdbd',
            light: '#ffffff',
        },
        secondary: {
            main: 'rgb(220, 0, 78)',
        },
        background: {
            default: '#D9D6D2',
            paper: '#fff',
        },
    },
    typography: {
        h4: {
            color: 'black',
        },
        h5: {
            color: 'black',
        },
    },
});