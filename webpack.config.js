/* eslint-disable @typescript-eslint/no-var-requires */
const configs = require('@salesforce/pwa-kit-dev/configs/webpack/config.js')
const {getConfig} = require('@salesforce/pwa-kit-runtime/utils/ssr-config')
const path = require('path')
const webpack = require('webpack')
// Extend the webpack config to add new root resolvers
const blm = getConfig()?.app?.blm

// Convert blm object to a format suitable for DefinePlugin
const envVariables = {}
for (const [key, value] of Object.entries(blm)) {
    envVariables[`process.env.${key}`] = JSON.stringify(value)
}

configs.forEach((c) => {
    c.resolve = {
        ...c.resolve,
        alias: {
            ...c?.resolve?.alias,
            '@bloomreach': path.resolve(__dirname, './bloomreach'),
            '~': path.resolve(__dirname, './overrides')
        }
    }
    // Add DefinePlugin to plugins array
    c.plugins = [...c.plugins, new webpack.DefinePlugin(envVariables)]
})
module.exports = configs
