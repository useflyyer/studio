import React from "react"
import styled from "styled-components"

import Head from 'next/head'

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const IFrame = styled.iframe`
  margin: 0;
  border: 0;
  padding: 0;
  overflow: hidden;

  width: 1200px;
  height: 630px;

  transform: scale(0.50);
  transform-origin: left top;
`;

const IFrameWrap = styled.div`
  width: calc(1200px * 0.5);
  height: calc(630px * 0.5);
  position: absolute;
  overflow: hidden;
`;

const IFrameContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: calc(1200px  * 0.5);
  height: calc(630px * 0.5);
`;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container>
          <h1>Hello</h1>
          <IFrameContainer>
            <IFrameWrap>
              <IFrame src="http://localhost:7777/page.html" />
            </IFrameWrap>
          </IFrameContainer>
          <h1>Hello</h1>
        </Container>
      </main>
    </div>
  )
}
