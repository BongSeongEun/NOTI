/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Navigate, useNavigate, Link, Toggle } from "react-router-dom";

const theme = {
  OrangeTheme: {
    color1: "#FF7154",
    color2: "#FFB673",
    color3: "#7CCAE2",
    color4: "#5B9DFF",
    color5: "#7E85FF",
  },

  RedTheme: {
    color1: "#E63946",
    color2: "#D3EFC9",
    color3: "#A8DADC",
    color4: "#457B9D",
    color5: "#1D3557",
  },

  PinkTheme: {
    color1: "#FFAFCC",
    color2: "#FFC8DD",
    color3: "#CDB4DB",
    color4: "#A2D2FF",
    color5: "#BDE0FE",
  },

  GreenTheme: {
    color1: "#808744",
    color2: "#535E31",
    color3: "#AEA95B",
    color4: "#B08E45",
    color5: "#A87B38",
  },

  BlueTheme: {
    color1: "#264653",
    color2: "#2A9D8F",
    color3: "#E9C46A",
    color4: "#F4A261",
    color5: "#E76F51",
  },
};

export default theme;

// export const OrangeTheme = {
//   color1: "#FF7154",
//   color2: "#FFB673",
//   color3: "#7CCAE2",
//   color4: "#5B9DFF",
//   color5: "#7E85FF",
// };

// export const RedTheme = {
//   color1: "#E63946",
//   color2: "#D3EFC9",
//   color3: "#A8DADC",
//   color4: "#457B9D",
//   color5: "#1D3557",
// };

// export const PinkTheme = {
//   color1: "#FFAFCC",
//   color2: "#FFC8DD",
//   color3: "#CDB4DB",
//   color4: "#A2D2FF",
//   color5: "#BDE0FE",
// };

// export const BlueTheme = {
//   color1: "#264653",
//   color2: "#2A9D8F",
//   color3: "#E9C46A",
//   color4: "#F4A261",
//   color5: "#E76F51",
// };

// export const theme = {
//   OrangeTheme,
//   RedTheme,
//   PinkTheme,
//   BlueTheme,
// };
