/* eslint-disable prettier/prettier */
import React from 'react';
import Svg, { Ellipse, Circle, Path, SvgXml, } from 'react-native-svg';
import { useTheme } from 'styled-components/native';
import { theme } from '../components/theme';
import gradationSvg from './gradation.svg';

function DecoesSvg({ currentTheme }) {
  const { color1, color2, color4, color5 } = useTheme(); 
  const selectedTheme = theme[currentTheme] || theme.OrangeTheme;

  return (
    <Svg width="248.5" height="204" viewBox="0 0 637 548" fill="none" style={{ marginRight: 40 }}>
      <Ellipse cx="627" cy="151.565" rx="10" ry="9.56522" fill={color1} />
      <Ellipse cx="104.5" cy="205" rx="11.5" ry="11" fill={color2} />
      <Circle cx="180.5" cy="447.5" r="14.5" fill={color4} />
      <Path d="M584.602 19.662C587.303 15.8284 593.332 17.691 593.4 22.3802C593.43 24.4772 594.808 26.3162 596.811 26.9353C601.292 28.3196 601.384 34.6289 596.945 36.1426C594.96 36.8196 593.637 38.6978 593.667 40.7948C593.735 45.484 587.763 47.5208 584.952 43.7671C583.694 42.0885 581.499 41.4103 579.514 42.0872C575.076 43.601 571.293 38.5505 573.994 34.7169C575.202 33.0024 575.169 30.7051 573.912 29.0264C571.1 25.2728 574.735 20.1147 579.215 21.499C581.219 22.1181 583.394 21.3765 584.602 19.662Z" fill={color5} />
      <Path d="M37.5986 350.118C36.0757 343.251 44.2307 338.447 49.4995 343.108C51.8557 345.192 55.2862 345.522 57.9968 343.925C64.0577 340.355 71.1468 346.626 68.3421 353.077C67.0878 355.962 67.8338 359.327 70.1901 361.411C75.4588 366.072 71.6851 374.752 64.6829 374.079C61.5515 373.777 58.5821 375.526 57.3278 378.411C54.5231 384.863 45.1017 383.956 43.5789 377.088C42.8978 374.017 40.3166 371.733 37.1851 371.432C30.1829 370.758 28.134 361.518 34.1949 357.947C36.9055 356.35 38.2796 353.19 37.5986 350.118Z" fill={color1} /> 
      <Path d="M574.895 479.641C579.489 474.314 588.216 477.977 587.631 484.987C587.37 488.122 589.157 491.069 592.058 492.286C598.544 495.009 597.757 504.441 590.909 506.051C587.847 506.771 585.596 509.381 585.335 512.516C584.75 519.526 575.536 521.693 571.889 515.677C570.258 512.987 567.08 511.654 564.018 512.374C557.17 513.984 552.262 505.891 556.856 500.563C558.91 498.18 559.197 494.746 557.566 492.056C553.918 486.041 560.099 478.873 566.585 481.595C569.486 482.813 572.841 482.024 574.895 479.641Z" fill={color2} />
    </Svg>
	
  );
}

export default DecoesSvg;
