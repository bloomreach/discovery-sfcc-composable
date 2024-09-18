/* eslint-disable @typescript-eslint/no-var-requires */
const configs = require('@salesforce/pwa-kit-dev/configs/webpack/config.js')
const path = require('path')

configs.forEach((c) => {
    c.resolve = {
        ...c.resolve,
        alias: {
            ...c?.resolve?.alias,
            '@bloomreach': path.resolve(__dirname, './bloomreach'),
            '~': path.resolve(__dirname, './overrides')
        }
    }
})
module.exports = configs
