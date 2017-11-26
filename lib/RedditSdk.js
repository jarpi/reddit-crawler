const config = require('../.config.json')
const sendRequest = require('./SendRequest.js')
const redditAuth = require('./RedditAuthentication.js')({
  userName: process.env.BOT_USERNAME,
  password: process.env.BOT_USERPWD,
  clientId: process.env.BOT_CLIENTID,
  clientSecret: process.env.BOT_SECRET
})

const getProgrammingRedditPosts = (queryParams) => {
    return redditAuth.getToken()
    .then(token => {
      const apiUrl = config.apiBaseUrl
      const path = config.programmingBasePath
      const pathOpts = Object.keys(queryParams).reduce((prev, curr, idx, arr) => {
          prev += curr + '=' + queryParams[curr] + (idx<arr.length-1 ? '&' : '')
          return prev
      }, '?')
      const userAgent = eval(config.defaultUserAgent)
      const opts = {
          'method': 'get',
          'url': apiUrl + path + pathOpts,
          'headers': {
              'Authorization' : 'Bearer ' + token.access_token,
              'User-Agent': userAgent
          }
      }
      return sendRequest(opts)
      .catch(err => {
        if (err.error === 401) {
          return redditAuth.rebuildToken()
            .then(getProgrammingRedditPosts.bind(this, queryParams))
        }
        throw err
      })
    })
}

const getMe = () => {
  return redditAuth.getToken()
  .then(token => {
    const apiUrl = 'https://oauth.reddit.com'
    const path = config.meBasePath
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/' + process.env.BOT_USERNAME + ')'
    const opts = {
        'method': 'get',
        'url': apiUrl + path,
        'headers': {
            'Authorization' : 'Bearer ' + token.access_oken
        }
    }
    return sendRequest(opts)
    .catch(err => {
      if (err.error === 401) {
        return redditAuth.rebuildToken()
          .then(getProgrammingRedditPosts.bind(queryParams))
      }
      throw err
    })
  })
}

module.exports = {
    getMe: getMe,
    getProgrammingRedditPosts: getProgrammingRedditPosts
}
