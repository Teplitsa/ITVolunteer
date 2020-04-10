const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    client: ["./src/js/front-app.js", "@babel/polyfill", "./node_modules/air-datepicker/dist/js/datepicker.js"]
  },
  output: {
    path: path.resolve(__dirname, "../assets_spa/js/"),
    filename: "bundle-front-app.js"
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '../css/[name].css',
            }
          },        
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ],
      },
      // images
      {
        test: /\.(png|jp(e*)g|svg)$/,  
        use: [{
          loader: 'url-loader',
          options: { 
            limit: 8000, // Convert images < 8kb to base64 strings
            name: '[hash]-[name].[ext]',
            outputPath: '../img/',
            publicPath: '/wp-content/themes/tstsite/assets_spa/img/'
          } 
        }]
      },
      //File loader used to load fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: '../fonts/',
            publicPath: '/wp-content/themes/tstsite/assets_spa/fonts/'
          }
        }
      }
    ]
 },
};
