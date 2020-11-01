import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import classNames from "classnames";
import Head from "next/head";
import qs from "qs";
import JSON5 from "json5";
import { useForm } from "react-hook-form";
import { useSearchParam } from "react-use";
import { ErrorMessage } from "@hookform/error-message";

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
`;

const Aside = styled.aside`
  width: 320px;
  box-shadow: 0px 0px 10px #acacac;
  z-index: 10;
  background-color: white;
  padding: 0.75rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  /* margin-top: calc(0.75rem * 4); */
`;

type IFrameProps = { mode?: string; width: any; height: any; ratio: any };

const IFrame = styled.iframe<IFrameProps>`
  margin: 0;
  border: 0;
  padding: 0;
  overflow: hidden;

  width: ${(props) => props.width};
  height: ${(props) => props.height};

  transform: scale(${(props) => props.ratio});
  transform-origin: left top;
`;

const IFrameWrap = styled.div<IFrameProps>`
  width: calc(${(props) => props.width} * ${(props) => props.ratio});
  height: calc(${(props) => props.height} * ${(props) => props.ratio});
  position: absolute;
  overflow: hidden;
`;

const IFrameContainer = styled.div<IFrameProps>`
  position: relative;
  overflow: hidden;
  width: calc(${(props) => props.width} * ${(props) => props.ratio});
  height: calc(${(props) => props.height} * ${(props) => props.ratio});

  /* https://neumorphism.io/#CACACA */
  /* box-shadow: 20px 20px 60px #acacac, -20px -20px 60px #e8e8e8; */
  box-shadow: 20px 20px 60px #acacac;
`;

const Layer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
`;

const WorkspaceBackground = styled(Layer)`
  background-color: #e5e5e5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.2' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
`;
const WorkspaceContent = styled(Layer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const WorkspaceMenu = styled(Layer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  pointer-events: none;

  padding: calc(0.75rem * 2);
`;
const WorkspaceMenuItem = styled.div`
  pointer-events: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

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

type FormSchema = {
  template: string;
  base: string;
  variables: string;
};

function FORM_TO_URL(input: FormSchema) {
  const u = new URL(input.template, input.base);
  u.search = qs.stringify(JSON5.parse(input.variables));
  return u;
}

export default function Home() {
  const [url, setURL] = useState<URL>();
  const [settings, setSettings] = useState<IFrameProps>({
    mode: "banner",
    width: "1200px",
    height: "630px",
    ratio: 0.5,
  });
  const form = useForm<FormSchema>({
    mode: "onBlur",
  });

  const paramTemplate = useSearchParam("template") || "main";
  const paramHost = useSearchParam("host") || "localhost";
  const paramPort = useSearchParam("port") || "7777";

  useEffect(() => {
    const input: FormSchema = {
      template: paramTemplate,
      base: "http:" + "//" + paramHost + ":" + paramPort,
      variables: JSON5.stringify({ title: "Hello World" }, null, 2),
    };
    form.setValue("template", input.template);
    form.setValue("base", input.base);
    form.setValue("variables", input.variables);
    setURL(FORM_TO_URL(input));
  }, [paramTemplate, paramHost, paramPort]);

  const handleValidSubmit = form.handleSubmit((input) => {
    try {
      setURL(FORM_TO_URL(input));
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  });

  function handleRatio(e: React.ChangeEvent<HTMLInputElement>) {
    const ratio = Number(e.target.value);
    setSettings((state) => ({ ...state, ratio }));
  }

  function handleSquare() {
    setSettings((state) => ({ ...state, mode: "square", width: "1200px", height: "1200px" }));
  }
  function handleBanner() {
    setSettings((state) => ({ ...state, mode: "banner", width: "1200px", height: "630px" }));
  }
  function handleStory() {
    setSettings((state) => ({ ...state, mode: "story", width: "1080px", height: "1920px" }));
  }

  const cloned = useMemo(() => {
    if (!url) return null;
    const cloned = new URL(url.href);
    if (!cloned.pathname.endsWith(".html")) {
      cloned.pathname = cloned.pathname + ".html";
    }
    return cloned;
  }, [url]);

  return (
    <div>
      <Head>
        <title>Flayyer Studio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container>
          <Aside>
            <div>
              <Logo>
                <a href="https://flayyer.com?ref=studio" rel="noreferrer noopener" target="_blank">
                  FLAYYER STUDIO
                </a>
              </Logo>
            </div>

            <form onSubmit={handleValidSubmit}>
              <div className="field">
                <p>
                  Get the Base URL by running <code>npm start</code> or <code>yarn start</code> on your project created
                  with{" "}
                  <a href="https://www.npmjs.com/package/create-flayyer-app" target="_blank" rel="noopener noreferrer">
                    create-flayyer-app
                  </a>
                </p>
              </div>

              <div className="field">
                <label className="label">Base URL</label>
                <div className="control">
                  <input
                    className="input"
                    name="base"
                    type="url"
                    ref={form.register({
                      validate: {
                        url: (value) => {
                          try {
                            new URL(value);
                            return true;
                          } catch (e) {
                            return e.message;
                          }
                        },
                      },
                    })}
                    placeholder="http://localhost:7777"
                  />
                </div>
                <p className="help is-danger">
                  <ErrorMessage name="base" errors={form.errors} />
                </p>
              </div>

              <div className="field">
                <label className="label">Template</label>
                <div className="control">
                  <input className="input" name="template" type="text" ref={form.register()} placeholder="main" />
                </div>
                <p className="help is-danger">
                  <ErrorMessage name="template" errors={form.errors} />
                </p>
              </div>

              <div className="field">
                <label className="label">Variables</label>
                <div className="control">
                  <textarea
                    style={{ minHeight: "100px" }}
                    className="input"
                    name="variables"
                    ref={form.register({
                      validate: {
                        json: (value) => {
                          try {
                            JSON5.parse(value);
                            return true;
                          } catch (e) {
                            return e.message;
                          }
                        },
                      },
                    })}
                    rows={4}
                    placeholder="{}"
                  />
                </div>
                <p className="help is-danger">
                  <ErrorMessage name="variables" errors={form.errors} />
                </p>
              </div>
              <button type="submit" className="button is-primary is-fullwidth">
                Refresh
              </button>
            </form>
          </Aside>
          <Content>
            <WorkspaceBackground></WorkspaceBackground>

            <WorkspaceContent>
              <div>
                <p style={{ zIndex: 9 }}>
                  {settings.width} x {settings.height}
                </p>
                <IFrameContainer {...settings}>
                  {cloned && (
                    <IFrameWrap {...settings}>
                      <IFrame {...settings} src={cloned.href} />
                    </IFrameWrap>
                  )}
                </IFrameContainer>
              </div>
            </WorkspaceContent>

            <WorkspaceMenu>
              <WorkspaceMenuItem>
                <div className="field has-addons has-shadow">
                  <p className="control">
                    <button
                      className={classNames({
                        "button is-primary is-light has-text-weight-semibold": true,
                        "is-active": settings.mode === "banner",
                      })}
                      onClick={handleBanner}
                    >
                      <span>Banner (1:1.91)</span>
                    </button>
                  </p>
                  <p className="control">
                    <button
                      className={classNames({
                        "button is-primary is-light has-text-weight-semibold": true,
                        "is-active": settings.mode === "square",
                      })}
                      onClick={handleSquare}
                    >
                      <span>Square (1:1)</span>
                    </button>
                  </p>
                  <p className="control">
                    <button
                      className={classNames({
                        "button is-primary is-light has-text-weight-semibold": true,
                        "is-active": settings.mode === "story",
                      })}
                      onClick={handleStory}
                    >
                      <span>Story (9:16)</span>
                    </button>
                  </p>
                </div>

                <div className="field" style={{ marginLeft: "1.5rem" }}>
                  <label style={{ display: "none" }} className="label">
                    Zoom
                  </label>
                  <div className="control">
                    <input
                      // className="input"
                      type="range"
                      min="0.10"
                      max="1"
                      step={0.001}
                      value={settings.ratio}
                      onChange={handleRatio}
                    ></input>
                  </div>
                </div>
              </WorkspaceMenuItem>
            </WorkspaceMenu>
          </Content>
        </Container>
      </main>
    </div>
  );
}
