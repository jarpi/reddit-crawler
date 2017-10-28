const request = require('request')
let accessToken;

const getProgrammingRedditPosts = () => {
    const apiUrl = 'https://oauth.reddit.com'
    const path = '/r/programming.json?limit=1'
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'
    return new Promise((resolve, reject) => {
        request.get({
            'url': apiUrl + path,
            'headers': {
                'User-Agent': userAgent,
                'Authorization' : 'Bearer ' + accessToken
            }
        }, (error, response, body) => {
            if (error) return reject(error)
            const res = JSON.parse(body)
            if (res.error) return reject(res)
            return resolve(res)
        })

    })

}

const getMe = () => {
    const apiUrl = 'https://oauth.reddit.com'
    const path = '/api/v1/me'
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'
    return new Promise((resolve, reject) => {
        request.get({
            'url': apiUrl + path,
            'headers': {
                'User-Agent': userAgent,
                'Authorization' : 'Bearer ' + accessToken
            }
        }, (error, response, body) => {
            if (error) return reject(error)
            const res = JSON.parse(body)
            if (res.error) return reject(res)
            return resolve(res)
        })

    })
}

const getAccessToken = () => {
    const userName = process.env.BOT_USERNAME
    const pwd = process.env.BOT_USERPWD
    const grantType = 'password'
    const clientId = process.env.BOT_CLIENTID
    const secret = process.env.BOT_SECRET
    const apiUrl = 'https://www.reddit.com/api/v1/access_token'
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'

    return new Promise((resolve, reject) => {
        request.post({
            'auth': {
                'user': clientId,
                'password': secret
            },
            'url': apiUrl,
            'form': {
                'grant_type': grantType,
                'username': userName,
                'password': pwd

            },
            'headers': {
                'User-Agent': userAgent
            }
        }, (error, response, body) => {
            if (error) return reject(error)
            const res = JSON.parse(body)
            if (res.error) return reject(res)
            return resolve(res)
        })
    })
}


getAccessToken()
    .then( token => {
        accessToken = token.access_token;
        return accessToken
    })
    .then(getMe)
    .then( res => {
        console.dir(res)
    })
    .then(getProgrammingRedditPosts)
    .then( res => {
        console.dir(res)
    })
    .catch( err => {
        console.log('error')
        console.dir(err)
    })

module.exports = getProgrammingRedditPosts

