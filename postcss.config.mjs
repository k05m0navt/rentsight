const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {
      overrideBrowserslist: [
        'last 2 versions',
        'IE 11',
        'Edge >= 15'
      ]
    },
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': {
          preserve: true // Keep custom properties for modern browsers
        }
      }
    }
  }
};

export default config;
