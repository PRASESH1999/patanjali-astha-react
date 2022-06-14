import React from 'react';
import { ThemeProvider } from '@mui/material';
import { StylesProvider } from '@mui/styles';
import { PureLightTheme } from './schemes/PureLightTheme';

const ThemeProviderWrapper = function (props) {
  return (
    <StylesProvider injectFirst>
        <ThemeProvider theme={PureLightTheme}>{props.children}</ThemeProvider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
