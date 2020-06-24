const path = require("path")
const SpritePlugin = require('./node_modules/svg-sprite-loader/plugin');

module.exports = {
  mode: "production",
  entry: {
    client: ["./src/sass/email-main.scss", "./src/img/pic-logo-itv.svg", "./src/img/pic-logo-teplitsa.svg"]
  },
  output: {
    path: path.resolve(__dirname, "../assets_email/"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/[name].css',
            }
          },        
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ],
      },
      // images
      {
        test: /\.svg$/,  
        use: [{
          loader: 'svg-sprite-loader',
          options: { 
            extract: true,
            spriteFilename: svgPath => `img/sprite${svgPath.substr(-4)}`
          } 
        }, 'svgo-loader']
      },
    ]
 },
  plugins: [
    new SpritePlugin()
  ], 
};
