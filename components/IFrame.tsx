import styled from "styled-components";

export type IFrameProps = { mode?: string; width: any; height: any; ratio: any };

export const IFrame = styled.iframe<IFrameProps>`
  margin: 0;
  border: 0;
  padding: 0;
  overflow: hidden;

  width: ${(props) => props.width};
  height: ${(props) => props.height};

  transform: scale(${(props) => props.ratio});
  transform-origin: left top;
`;

export const IFrameWrap = styled.div<IFrameProps>`
  width: calc(${(props) => props.width} * ${(props) => props.ratio});
  height: calc(${(props) => props.height} * ${(props) => props.ratio});
  position: absolute;
  overflow: hidden;
`;

export const IFrameContainer = styled.div<IFrameProps>`
  position: relative;
  overflow: hidden;
  width: calc(${(props) => props.width} * ${(props) => props.ratio});
  height: calc(${(props) => props.height} * ${(props) => props.ratio});

  /* https://neumorphism.io/#CACACA */
  /* box-shadow: 20px 20px 60px #acacac, -20px -20px 60px #e8e8e8; */
  box-shadow: 20px 20px 60px #acacac;
`;
