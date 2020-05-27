const appConfig = require("./app.config");
const withImages = require("next-images");

imagesConfig = withImages({
  esModule: true,
  webpack: (config) => config,
});

module.exports = {
  env: { ...appConfig },
  compress: false,
  ...imagesConfig,
};
