const fs = require('fs')
const sendRequest = require('./SendRequest.js')
let token = null;

const getAccessToken = () => {
  if (token) return Promise.resolve(token)
    return readToken()
    .then(setToken)
    .catch(e => {
      return authenticate()
      .then(storeToken)
    })
    .catch(e => {
      return token
    })
}

const setToken = retrievedToken => {
  token = retrievedToken
  return retrievedToken
}

const authenticate = () => {
  const userName = process.env.BOT_USERNAME
  const pwd = process.env.BOT_USERPWD
  const grantType = 'password'
  const clientId = process.env.BOT_CLIENTID
  const secret = process.env.BOT_SECRET
  const apiUrl = 'https://www.reddit.com/api/v1/access_token'

  const opts = {
      'method': 'post',
      'auth': {
          'user': clientId,
          'password': secret
      },
      'url': apiUrl,
      'form': {
          'grant_type': grantType,
          'username': userName,
          'password': pwd

      }
  }

  return sendRequest(opts)
  .then(storeToken)
}

const readToken = () => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile('./.token.json', (err, data) =>{
                if (err) throw new Error('readToken:cannot_read_file')
                const token = JSON.parse(data)
                if (!token && !token.access_token) throw new Error('readToken:invalid_format')
                return resolve(token)
            })
        } catch (e) {
          reject(e)
        }
    })
}

const storeToken = token => {
    return new Promise((resolve, reject) => {
        if (!token || !token.access_token) return reject('storeToken:invalid_token')
        fs.writeFile('./.token.json', JSON.stringify(token), (err) => {
            if (err) return reject(err)
            return resolve(token)
        })
    })
}

module.exports = {
  getToken: getAccessToken,
  rebuildToken: authenticate
}
