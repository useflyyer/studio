const NODE_ENV = process.env.NODE_ENV || "development";

const config = {
  future: {
    webpack5: true,
  },
  poweredByHeader: false,
  // Build time
  env: {},
  // Will be available on both server and client
  publicRuntimeConfig: {},
  // Will only be available on the server side
  serverRuntimeConfig: {},
  redirects() {
    return [];
  },
};

if (NODE_ENV === "production") {
  config.basePath = "/studio";
  config.assetPrefix = "/studio/";
}

module.exports = config;
