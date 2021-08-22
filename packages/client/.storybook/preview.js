import React from 'react';
import { MemoryRouter } from "react-router-dom"
import GlobalStyle from '../src/GlobalStyle';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (storyFn) => (<><GlobalStyle/>{storyFn()}</>),
  (storyFn) => <MemoryRouter>{storyFn()}</MemoryRouter>
];