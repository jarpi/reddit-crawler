const sendRequest = require('./SendRequest.js')
const redditAuth = require('./RedditAuthentication.js')

const getProgrammingRedditPosts = (queryParams) => {
    const apiUrl = 'https://oauth.reddit.com'
    const path = '/r/programming.json'
    const pathOpts = Object.keys(queryParams).reduce((prev, curr, idx, arr) => {
        prev += curr + '=' + queryParams[curr] + (idx<arr.length-1 ? '&' : '')
        return prev
    }, '?')
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'
    const opts = {
        'method': 'get',
        'url': apiUrl + path + pathOpts,
        'headers': {
            'Authorization' : 'Bearer ' + redditAuth.getToken()
        }
    }
    return sendRequest(opts)
    .catch(catchAuthErr)
}

const getMe = () => {
    const apiUrl = 'https://oauth.reddit.com'
    const path = '/api/v1/me'
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'
    const opts = {
        'method': 'get',
        'url': apiUrl + path,
        'headers': {
            'Authorization' : 'Bearer ' + redditAuth.getToken()
        }
    }
    return sendRequest(opts)
    .catch(catchAuthErr)
}

const catchAuthErr = err => {
  if (err.error === 401) {
    return redditAuth.rebuildToken()
      .then(arguments.caller)
  }
  throw err
}

module.exports = {
    getMe: getMe,
    getProgrammingRedditPosts: getProgrammingRedditPosts
}
