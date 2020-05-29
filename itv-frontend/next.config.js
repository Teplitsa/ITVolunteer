const appConfig = require("./app.config");
const withImages = require("next-images");
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

imagesConfig = withImages({
  esModule: true,
  webpack: (config) => config,
});


module.exports = phase => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const { relative, basename } = require('path');
    const { readFileSync } = require('fs');

    require('source-map-support').install({
      retrieveSourceMap: function(source) {
        if (source.indexOf('.next') > -1) {
          const rel = relative(process.cwd(), source);
          const mapPath = `${rel}.map`;
          return {
            url: basename(rel),
            map: readFileSync(mapPath, 'utf8')
          };
        } else {
          return null;
        }
      }
    });
  }

  return {
    env: { ...appConfig },
    compress: false,
    ...imagesConfig,
  };
};