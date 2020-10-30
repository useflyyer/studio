module.exports = {
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
  basePath: "/flayyer-studio",
  assetPrefix: "/flayyer-studio/",
};
