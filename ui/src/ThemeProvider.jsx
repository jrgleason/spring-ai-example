import React from 'react';
import {createTheme, StyledEngineProvider, ThemeProvider as MUIThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import {muiTheme} from './theme';
import './components/mui-overrides.css';

/**
 * Custom ThemeProvider that applies both Tailwind CSS variables and Material UI theming
 * Configured to work properly with Tailwind CSS v4 using CSS layers
 */
export const ThemeProvider = ({children}) => {
    // Create MUI theme using our theme configuration
    const theme = createTheme(muiTheme);

    return (
        <StyledEngineProvider enableCssLayer>
            <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </StyledEngineProvider>
    );
};

export default ThemeProvider;
