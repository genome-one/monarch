import React from 'react';
import styled from 'styled-components'

const Circle = styled.div`
  width: 5em;
  height: 5em;
  border-radius: 50%;
`;

const APosCircle = styled(Circle)`
  position: absolute;
`;

// Base is a opaque circle with a white circular mask in the middle
const Base = styled(Circle)`
  font-size: ${props => props.scale}px;
  position: relative;
  padding: 0;
  background-color: #F2E9E1; 
  line-height: 5em;

  &:after{
    border: none;
    position: absolute;
    top: ${props => 0.35 + props.thickness/2}em;
    left: ${props => 0.35 + props.thickness/2}em;
    text-align: center;
    display: block;
    border-radius: 50%;
    width: ${props => 4.3 - props.thickness}em;
    height: ${props => 4.3 - props.thickness}em;
    background-color: white;
    content: " ";
  }
`;

// a round circle, but clips the whole left half
const LeftHalfClipper = styled(APosCircle)` 
  clip: ${props => (props.value > 50) ? 'rect(auto,auto,auto,auto);' : 'rect(0, 5em, 5em, 2.5em)' };
`;

// Progress bar filling the whole right half for values above 50%
const First50Bar = styled(APosCircle)`
  clip: rect(0, 5em, 5em, 2.5em);
  background-color: ${props => props.color};
  display: ${props => (props.value > 50) ? 'block' : 'none' };
`;

// This is an overlayed square, that is made round with the border radius,
// then it is cut to display only the left half, then rotated clockwise
const ValueBar = styled(APosCircle)`
  clip: rect(0, 2.5em, 5em, 0);
  border: ${props => 0.45 + props.thickness/2}em solid ${props => props.color}; /*The border is 0.35 but making it larger removes visual artifacts */
  box-sizing: border-box;
  transform: rotate(${props => props.value * 3.6}deg);
`;

const Value = styled.span`
  position: absolute;
  line-height: 5em;
  width: 5em;
  text-align: center;
  display: block;
  color: #53777A;
  z-index: 2;
`;

/**
 * Triptych visualisation
 */
export default function Radial({value, thickness, style, scale, valueBarColor}) {
  if(!scale) thickness = 10;
  if(!thickness) thickness = 0;
  if(thickness > 3) thickness = 3;
  return (
    <Base 
      scale={scale} 
      thickness={thickness}
      style={style}
    >
      <Value>{value}</Value>
      <LeftHalfClipper value={value}>
        <First50Bar value={value} color={valueBarColor}></First50Bar>
        <ValueBar
          value={value}
          thickness={thickness}
          color={valueBarColor}
        ></ValueBar>
      </LeftHalfClipper>
    </Base>
  );
} 