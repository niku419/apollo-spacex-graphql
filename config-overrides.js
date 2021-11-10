/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const { override, addLessLoader } = require('customize-cra');

const overrideProcessEnv = () => (config) => {
  config.resolve.modules = [path.join(__dirname, 'src')].concat(
    config.resolve.modules
  );
  return config;
};

module.exports = override(
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true
    }
  }),
  overrideProcessEnv({
    // eslint-disable-next-line global-require
    VERSION: JSON.stringify(require('./package.json').version)
  })
);
