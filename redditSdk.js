const request = require('request')
let accessToken;

const getProgrammingRedditPosts = () => {
    const apiUrl = 'https://oauth.reddit.com'
    const path = '/r/programming.json?limit=1'
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'
    const opts = {
        'method': 'get',
        'url': apiUrl + path,
        'headers': {
            'Authorization' : 'Bearer ' + accessToken
        }
    }
    return sendRequest(opts)
}

const getMe = () => {
    const apiUrl = 'https://oauth.reddit.com'
    const path = '/api/v1/me'
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'
    const opts = {
        'method': 'get',
        'url': apiUrl + path,
        'headers': {
            'Authorization' : 'Bearer ' + accessToken
        }
    }
    return sendRequest(opts)
}

const getAccessToken = () => {
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
}

const sendRequest = ( opts ) => {
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'
    if (!opts.headers) opts.headers = {}
    opts.headers['User-Agent'] = userAgent

    return new Promise((resolve, reject) =>{
        request(opts, (error, response, body) => {
            if (error) return reject(error)
            let res;
            try {
                res = JSON.parse(body)
            } catch (e) {
                return reject(e)
            }
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

