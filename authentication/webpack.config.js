const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
const webpack = require('webpack');

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  [/* mapped paths to share */]);
  const sharedStore = `http://${process.env.SHARED_STORE ||  'localhost:3003'}`
module.exports = {
  output: {
    uniqueName: "mangorAuthentication",
    publicPath: "auto",
    scriptType:'text/javascript'
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_AUTH_SERVER': JSON.stringify(process.env.REACT_APP_AUTH_SERVER)
  }),
    new ModuleFederationPlugin({
        // For remotes (please adjust)
        name: "mangorAuthentication",
        filename: "remoteEntry.js",
        exposes: {
            './UsersTableForm':'./src/app/components/users-table/users-table-form.component.ts',
            './InputUserDataFormComponent':'./src/app/input-user-data-form/input-user-data-form.component.ts'
        },
        
        remotes: {
          store: `store@${sharedStore}/remoteEntry.js`,
        },

        shared: share({
          effector: { singleton: true },
          "@angular/core": { singleton: true, requiredVersion: 'auto' },
          "@angular/common": { singleton: true, requiredVersion: 'auto' },
          "@angular/common/http": { singleton: true, requiredVersion: 'auto' },
          "@angular/router": { singleton: true, requiredVersion: 'auto' },

          ...sharedMappings.getDescriptors()
        })

    }),
    sharedMappings.getPlugin()
  ],
};
