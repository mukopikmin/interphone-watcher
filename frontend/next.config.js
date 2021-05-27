const path = require('path')
const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
  },
  webpack(config, options) {
    config.resolve.alias['@'] = __dirname
    return config
  },
})
