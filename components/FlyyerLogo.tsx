import React from "react";

import styled from "styled-components";

export function FlyyerLogo(props: React.ComponentProps<typeof Logo>) {
  return (
    <Logo {...props}>
      <a href="https://flyyer.io?ref=studio" rel="noreferrer noopener" target="_blank">
        FLYYER STUDIO
      </a>
    </Logo>
  );
}
const Logo = styled.p`
  font-family: IBM Plex Sans;
  font-size: 1em;
  line-height: 1.5;
  cursor: pointer;
  box-sizing: inherit;
  font-style: inherit;
  font-weight: bold;
  color: #4346de;

  text-align: center;
  padding: 1.5rem;
  padding-bottom: calc(0.75rem * 3);
`;
