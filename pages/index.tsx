import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import classNames from "classnames";
import Head from "next/head";
import { useSearchParam } from "react-use";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import JSON5 from "json5";
import qs from "qs";

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
  /**
   * Pass `_ua=` query param to iframe.
   */
  agent?: string;
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
    defaultValues: {
      agent: "",
    },
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
    for (const [key, value] of Object.entries(input)) {
      form.setValue(key as any, value);
    }
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
    setSettings((state) => ({ ...state, mode: "square", width: "1080px", height: "1080px" }));
  }
  function handleBanner() {
    setSettings((state) => ({ ...state, mode: "banner", width: "1200px", height: "630px" }));
  }
  function handleStory() {
    setSettings((state) => ({ ...state, mode: "story", width: "1080px", height: "1920px" }));
  }

  const frame = { ...settings }; // clone

  // Adapt frame depending on user agent
  const agent = form.watch("agent");
  const forceSquare = agent === "whatsapp"; // TODO: check other platforms where a format is forced.
  if (forceSquare) {
    frame.width = "630px";
    frame.height = "630px";
  }

  const cloned = useMemo(() => {
    if (!url) return null;
    const cloned = new URL(url.href);
    if (!cloned.pathname.endsWith(".html")) {
      cloned.pathname = cloned.pathname + ".html";
    }
    if (forceSquare) {
      cloned.searchParams.set("_ua", "whatsapp");
    }
    return cloned;
  }, [url, forceSquare]);

  const MODES = [
    {
      name: "Banner (1:1.91)",
      mode: "banner",
      action: handleBanner,
    },
    {
      name: "Square (1:1)",
      mode: "square",
      action: handleSquare,
    },
    {
      name: "Story (9:16)",
      mode: "story",
      action: handleStory,
    },
  ];

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
                      validate: { url: VALIDATE_URL },
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
                <p className="help">{"Same as your template's file name without extension"}</p>
              </div>

              <div className="field">
                <label className="label">User agent</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select name="agent" ref={form.register}>
                      <option value="">Default</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
                <p className="help">
                  Read this value form the <code>agent</code> prop
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
                      validate: { json: VALIDATE_JSON5 },
                    })}
                    rows={4}
                    placeholder="{}"
                  />
                </div>
                <p className="help is-danger">
                  <ErrorMessage name="variables" errors={form.errors} />
                </p>
                <p className="help">
                  Read this value form the <code>variables</code> prop
                </p>
              </div>

              <button type="submit" className="mt-4 button is-primary is-fullwidth has-text-weight-semibold">
                Refresh
              </button>
            </form>
          </Aside>
          <Content>
            <WorkspaceBackground></WorkspaceBackground>

            <WorkspaceContent>
              <div>
                <p style={{ zIndex: 9 }}>
                  {frame.width} x {frame.height}
                </p>
                <IFrameContainer {...frame}>
                  {cloned && (
                    <IFrameWrap {...frame}>
                      <IFrame {...frame} src={cloned.href} />
                    </IFrameWrap>
                  )}
                </IFrameContainer>
              </div>
            </WorkspaceContent>

            <WorkspaceMenu>
              <WorkspaceMenuItem>
                {forceSquare ? (
                  <div className="field">
                    <p className="text">WhatsApp has a fixed size</p>
                  </div>
                ) : (
                  <div className="field has-addons has-shadow">
                    {MODES.map((mode) => (
                      <p key={mode.mode} className="control">
                        <button
                          className={classNames({
                            "button is-primary is-light has-text-weight-semibold": true,
                            "is-active": frame.mode === mode.mode,
                          })}
                          onClick={mode.action}
                        >
                          <span>{mode.name}</span>
                        </button>
                      </p>
                    ))}
                  </div>
                )}

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
                      value={frame.ratio}
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

function VALIDATE_URL(value: string) {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return e.message;
  }
}

function VALIDATE_JSON5(value: string) {
  try {
    JSON5.parse(value);
    return true;
  } catch (e) {
    return e.message;
  }
}
