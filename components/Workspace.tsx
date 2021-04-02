import styled from "styled-components";

import { Layer } from "~/components/Layer";

export const WorkspaceBackground = styled(Layer)`
  background-color: #e5e5e5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.2' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
`;

export const WorkspaceContent = styled(Layer)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: calc(0.75rem * 3);
`;

export const WorkspaceContentItem = styled.div`
  margin: 0 0.75rem;
`;

export const WorkspaceMenu = styled(Layer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  pointer-events: none;

  padding: calc(0.75rem * 2);
`;

export const WorkspaceMenuItem = styled.div`
  pointer-events: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
