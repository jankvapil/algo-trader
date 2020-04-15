const withCSS = require('@zeit/next-css');

module.exports = withCSS({

  cssModules: true,
  
  webpack: (config) => {
    config.target = 'electron-renderer';

    config.module.rules = [
      ...(config.module.rules || []),
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000',
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ];

    return config;
  },
});
