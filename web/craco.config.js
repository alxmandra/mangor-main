const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const deps = require('./package.json').dependencies;
const webpack = require('webpack');

module.exports = (environment) => {
  const shared_store = `http://${process.env.SHARED_STORE || 'localhost:3003'}`;
  const authentication = `http://${process.env.AUTHENTICATION || 'localhost:3001'}`;
  return {
    plugins: [
      {
        plugin: {
          overrideCracoConfig: ({ cracoConfig, pluginOptions, context: { env, paths } }) => { return cracoConfig; },
          overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
            webpackConfig.plugins = [
              ...webpackConfig.plugins,
              // fix "process is not defined" error:
              new webpack.DefinePlugin({
                'process.env.REACT_APP_AUTH_SERVER': JSON.stringify(process.env.REACT_APP_AUTH_SERVER),
                'process.env.REACT_APP_HOST': `${JSON.stringify(process.env.REACT_APP_HOST || 'localhost:3004/')}`,
                'process.env.REACT_APP_PHOTOSERVICE': `${JSON.stringify(process.env.REACT_APP_PHOTOSERVICE || "")}`,

              }),
              new ModuleFederationPlugin({
                name: "shell",
                remotes: {
                  mangorAuthentication: `mangorAuthentication@${environment.env === 'development'? authentication : 'authentication'}/remoteEntry.js`,
                  store: `store@${environment.env === 'development'? shared_store : 'shared_store'}/remoteEntry.js`,
                },
                shared: {
                  ...deps,
                  'react-dom': { singleton: true, eager: true },
                  react: { singleton: true, eager: true },
                  effector: { singleton: true },
                  'effector-react': { singleton: true },
                  "@angular/core": { singleton: true, requiredVersion: 'auto' },
                  "@angular/common": { singleton: true, requiredVersion: 'auto' },
                  "@angular/common/http": { singleton: true, requiredVersion: 'auto' },
                  "@angular/router": { singleton: true, requiredVersion: 'auto' },
                }
              }),
            ]
            return webpackConfig;
          },
          overrideDevServerConfig: ({ devServerConfig, cracoConfig, pluginOptions, context: { env, paths, proxy, allowedHost } }) => { return devServerConfig; },
          overrideJestConfig: ({ jestConfig, cracoConfig, pluginOptions, context: { env, paths, resolve, rootDir } }) => { return jestConfig },
        },
      }
    ]
  }
};