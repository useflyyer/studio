import React, { useEffect, useState } from "react";

import Flayyer from "@flayyer/flayyer";
import { Sizes } from "@flayyer/flayyer-types";
import { ErrorMessage } from "@hookform/error-message";
import clsx from "clsx";
import JSON5 from "json5";
import NextHead from "next/head";
import qs from "qs";
import { useForm } from "react-hook-form";
import { useLocalStorage, useSearchParam, useSet } from "react-use";
import styled from "styled-components";

enum FrameMode {
  THUMBNAIL = "THUMBNAIL",
  BANNER = "BANNER",
  SQUARE = "SQUARE",
  STORY = "STORY",
}

const flayyer = new Flayyer({
  tenant: "flayyer",
  deck: "landing",
  template: "demo",
  extension: "png",
  meta: {
    id: "flayyer-studio",
  },
  variables: { title: "Flayyer Studio", description: "Development companion tool" },
});

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
  background-color: white;
  padding: 0.75rem;
  overflow-y: scroll;
  z-index: 10;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: calc(0.75rem * 3);
`;
const WorkspaceContentItem = styled.div`
  margin: 0 0.75rem;
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

const initialModes = new Set<FrameMode>([FrameMode.BANNER]);

export default function Home() {
  const [modes, setModes] = useSet<FrameMode>(initialModes);
  const [ratio, setRatio] = useState(0.4);
  const [url, setURL] = useState<URL>();
  const form = useForm<FormSchema>({
    mode: "onBlur",
    defaultValues: { agent: "" },
  });
  const {
    reset: formReset,
    formState: { errors },
  } = form;

  const [settings, setSettings] = useLocalStorage<{ ratio?: number; variables?: string; modes?: FrameMode[] }>(
    "settings",
  );

  const paramTemplate = useSearchParam("template") || "main";
  const paramHost = useSearchParam("host") || "localhost";
  const paramPort = useSearchParam("port") || "7777";

  // Kind of "on mount"
  useEffect(() => {
    const input: FormSchema = {
      template: paramTemplate,
      base: "http:" + "//" + paramHost + ":" + paramPort,
      variables: settings?.variables ? settings.variables : JSON5.stringify({ title: "Hello World" }, null, 2),
    };
    formReset(input);
    setURL(FORM_TO_URL(input));
    if (settings?.ratio) setRatio(settings.ratio);
    if (settings?.modes) settings.modes.forEach((m) => setModes.add(m));
  }, [formReset, paramTemplate, paramHost, paramPort]);

  const handleValidSubmit = form.handleSubmit((input) => {
    try {
      setURL(FORM_TO_URL(input));
      // Save to local storage
      setSettings({ ratio, variables: form.getValues("variables"), modes: Array.from(modes) });
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  });

  function handleRatio(e: React.ChangeEvent<HTMLInputElement>) {
    setRatio(Number(e.target.value));
  }

  function handleThumb() {
    setModes.toggle(FrameMode.THUMBNAIL);
  }
  function handleSquare() {
    setModes.toggle(FrameMode.SQUARE);
  }
  function handleBanner() {
    setModes.toggle(FrameMode.BANNER);
  }
  function handleStory() {
    setModes.toggle(FrameMode.STORY);
  }

  const MODES = [
    {
      name: "Thumbnail (small)",
      mode: FrameMode.THUMBNAIL,
      size: Sizes.THUMBNAIL,
      action: handleThumb,
    },
    {
      name: "Banner (1:1.91)",
      mode: FrameMode.BANNER,
      size: Sizes.BANNER,
      action: handleBanner,
    },
    {
      name: "Square (1:1)",
      mode: FrameMode.SQUARE,
      size: Sizes.SQUARE,
      action: handleSquare,
    },
    {
      name: "Story (9:16)",
      mode: FrameMode.STORY,
      size: Sizes.STORY,
      action: handleStory,
    },
  ];

  const agent = form.watch("agent");

  return (
    <div>
      <NextHead>
        <title>Flayyer Studio</title>
        <link rel="icon" href="/flayyer-studio/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta property="og:title" content={"Flayyer Studio"} />
        <meta property="og:description" content={"Test your flayyers locally"} />
        <meta name="twitter:site" content={"https://flayyer.github.io/flayyer-studio"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={flayyer.href()} />
        <meta property="og:image" content={flayyer.href()} />
      </NextHead>
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
                  <a href="https://github.com/flayyer/create-flayyer-app" target="_blank" rel="noopener noreferrer">
                    create-flayyer-app
                  </a>
                </p>
              </div>

              <div className="field">
                <label className="label">Base URL</label>
                <div className="control">
                  <input
                    className="input"
                    type="url"
                    {...form.register("base", {
                      validate: { url: VALIDATE_URL },
                    })}
                    placeholder="http://localhost:7777"
                  />
                </div>
                <p className="help is-danger">
                  <ErrorMessage name="base" errors={errors} />
                </p>
              </div>

              <div className="field">
                <label className="label">Template</label>
                <div className="control">
                  <input className="input" type="text" {...form.register("template")} placeholder="main" />
                </div>
                <p className="help is-danger">
                  <ErrorMessage name="template" errors={errors} />
                </p>
                <p className="help">{"Same as your template's file name without extension"}</p>
              </div>

              <div className="field">
                <label className="label">User agent</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select {...form.register("agent")}>
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
                    {...form.register("variables", {
                      validate: { json: VALIDATE_JSON5 },
                    })}
                    rows={4}
                    placeholder="{}"
                  />
                </div>
                <p className="help is-danger">
                  <ErrorMessage name="variables" errors={errors} />
                </p>
                <p className="help">
                  Read this value form the <code>variables</code> prop
                </p>
              </div>

              <button type="submit" className="my-4 button is-primary is-fullwidth has-text-weight-semibold">
                Refresh
              </button>
            </form>
          </Aside>
          <Content>
            <WorkspaceBackground />

            <WorkspaceContent>
              {MODES.map((MODE) => {
                if (!url) return;
                if (!modes.has(MODE.mode)) return;
                const [width, height] = MODE.size;
                const frame: IFrameProps = {
                  width: width + "px",
                  height: height + "px",
                  ratio,
                  mode: MODE.mode,
                };
                const cloned = new URL(url.href);
                if (!cloned.pathname.endsWith(".html")) {
                  cloned.pathname = cloned.pathname + ".html";
                }
                cloned.searchParams.set("_w", String(width));
                cloned.searchParams.set("_h", String(height));
                if (agent) {
                  cloned.searchParams.set("_ua", agent);
                }

                return (
                  <WorkspaceContentItem key={MODE.mode}>
                    <p style={{ zIndex: 9 }}>
                      {width} x {height}px
                    </p>
                    <IFrameContainer {...frame}>
                      {cloned && (
                        <IFrameWrap {...frame}>
                          <IFrame {...frame} src={cloned.href} />
                        </IFrameWrap>
                      )}
                    </IFrameContainer>
                  </WorkspaceContentItem>
                );
              })}
            </WorkspaceContent>

            <WorkspaceMenu>
              <WorkspaceMenuItem>
                {false ? (
                  <div className="field">
                    <p className="text">WhatsApp has a fixed size</p>
                  </div>
                ) : (
                  <div className="field has-addons has-shadow">
                    {MODES.map((mode) => (
                      <p key={mode.mode} className="control">
                        <button
                          className={clsx({
                            "button is-primary is-light has-text-weight-semibold": true,
                            "is-active": modes.has(mode.mode),
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
                      value={ratio}
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
