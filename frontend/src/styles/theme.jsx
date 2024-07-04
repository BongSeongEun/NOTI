/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Navigate, useNavigate, Link, Toggle } from "react-router-dom";

const theme = {
  OrangeTheme: {
    color1: "#4059AD",
    color2: "#6B9AC4",
    color3: "#97D8C4",
    color4: "#dcdcdc",
    color5: "#F4B942",
  },

  RedTheme: {
    color1: "#FF7154",
    color2: "#FFB673",
    color3: "#7CCAE2",
    color4: "#5B9DFF",
    color5: "#7E85FF",
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
