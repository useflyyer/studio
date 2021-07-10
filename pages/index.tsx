import React, { useEffect, useState } from "react";

import { FlyyerRender } from "@flyyer/flyyer";
import { Sizes } from "@flyyer/types";
import { ErrorMessage } from "@hookform/error-message";
import clsx from "clsx";
import dedent from "dedent";
import JSON5 from "json5";
import NextHead from "next/head";
import qs from "qs";
import { useForm } from "react-hook-form";
import { useLocalStorage, useSearchParam, useSet } from "react-use";
import styled from "styled-components";

import { FlyyerLogo } from "~/components/FlyyerLogo";
import { IFrameProps, IFrameContainer, IFrameWrap, IFrame } from "~/components/IFrame";
import {
  WorkspaceBackground,
  WorkspaceContent,
  WorkspaceContentItem,
  WorkspaceMenu,
  WorkspaceMenuItem,
} from "~/components/Workspace";

const flyyer = new FlyyerRender({
  tenant: "flyyer",
  deck: "landing",
  template: "demo",
  extension: "png",
  meta: {
    id: "flyyer-studio",
  },
  variables: { title: "Flyyer Studio", description: "Development companion tool" },
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

type FormSchema = {
  template: string;
  base: string;
  variables: string;
  /**
   * Pass `_ua=` query param to iframe.
   */
  agent?: string;
  // TODO: Locale variable `_lang`
};

const DEFAULT_VARIABLES = JSON5.stringify({ title: "Hello World" }, null, 2);

function FORM_TO_URL(input: FormSchema) {
  const u = new URL(input.template, input.base);
  u.search = qs.stringify(JSON5.parse(input.variables || "{}"));
  return u;
}

enum FrameMode {
  THUMBNAIL = "THUMBNAIL",
  BANNER = "BANNER",
  SQUARE = "SQUARE",
  STORY = "STORY",
}

const INITIAL_MODE = new Set<FrameMode>([FrameMode.BANNER]);

export default function Home() {
  const [modes, setModes] = useSet<FrameMode>(INITIAL_MODE);
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

  interface LocalStorageState {
    ratio?: number;
    variables?: string;
    modes?: FrameMode[];
  }
  const [settings, setSettings] = useLocalStorage<LocalStorageState>("settings");

  const paramTemplate = useSearchParam("template") || "main";
  const paramProtocol = useSearchParam("protocol") || "http:";
  const paramHost = useSearchParam("host") || "localhost";
  const paramPort = useSearchParam("port") || "7777";

  // Kind of "on mount", ignore `settings` dependency
  useEffect(() => {
    const protocol = paramProtocol.endsWith(":") ? paramProtocol : `${paramProtocol}:`;
    const input: FormSchema = {
      template: paramTemplate,
      base: protocol + "//" + paramHost + ":" + paramPort,
      variables: settings?.variables ? settings.variables : DEFAULT_VARIABLES,
    };
    formReset(input);
    setURL(FORM_TO_URL(input));
    if (settings?.ratio) setRatio(settings.ratio);
    if (settings?.modes) settings.modes.forEach((m) => setModes.add(m));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formReset, paramTemplate, paramProtocol, paramHost, paramPort]);

  const handleValidSubmit = form.handleSubmit((input) => {
    try {
      setURL(FORM_TO_URL(input));
      // Save to local storage
      const data: LocalStorageState = { ratio, variables: form.getValues("variables"), modes: Array.from(modes) };
      setSettings(data);
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

  const META_URL = "https://useflyyer.github.io/studio";
  const META_TWITTER = "@useflyyer";
  const META_TITLE = "Flyyer Studio for developers";
  const META_DESCRIPTION = dedent`
    The official developer workspace to create and preview your flyyers locally.
    It connects to your localhost so you don't need to install additional software.
  `;
  return (
    <div>
      <NextHead>
        <meta charSet="UTF-8" />
        <title>Flyyer Studio</title>
        <link rel="icon" href="/studio/favicon.ico?__v=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/studio/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/studio/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/studio/favicon-16x16.png" />
        <link rel="manifest" href="/studio/site.webmanifest" />
        <meta property="og:title" content={META_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:url" content={META_URL} />
        <meta property="og:image" content={flyyer.href()} />
        <meta property="og:site_name" content="Flyyer Studio" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:title" content={META_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        <meta name="twitter:url" content={META_URL} />
        <meta name="twitter:site" content={META_TWITTER} />
        <meta name="twitter:creator" content={META_TWITTER} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={flyyer.href()} />
      </NextHead>
      <main>
        <Container>
          <Aside>
            <div>
              <FlyyerLogo />
            </div>

            <form onSubmit={handleValidSubmit}>
              <div className="field">
                <p>
                  Get the Base URL by running <code>npm start</code> or <code>yarn start</code> on your project created
                  with{" "}
                  <a href="https://github.com/useflyyer/create-flyyer-app" target="_blank" rel="noopener noreferrer">
                    create-flyyer-app
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
  if (!value) return true;
  try {
    JSON5.parse(value);
    return true;
  } catch (e) {
    return e.message;
  }
}
