const request = require('request')
const fs = require('fs')
let accessToken;

const getProgrammingRedditPosts = (queryParams) => {
    const apiUrl = 'https://oauth.reddit.com'
    const path = '/r/programming.json'
    const pathOpts = Object.keys(queryParams).reduce((prev, curr) => {
        prev += curr + '=' + queryParams[curr]
        return prev
    }, '?')
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/jarpidev)'
    const opts = {
        'method': 'get',
        'url': apiUrl + path + pathOpts,
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

const getAccessToken = ( token ) => {
    if (token && token.accessToken) return Promise.resolve(token)
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

const readToken = () => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile('./.token.json', (err, data) =>{
                if (err) throw new Error('readToken:cannot_read_file')
                const token = JSON.parse(data)
                if (!token && !token.access_token) throw new Error('readToken:invalid_format')
                accessToken = token.access_token
                return resolve()
            })
        } catch (e) {
            return rebuildToken()
                .then(() => {return resolve()})
        }
    })
}

const rebuildToken = () => {
    return getAccessToken()
        .then(storeToken)
        .then(token => {
            accessToken = token.access_token
            return
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

const getProgPosts = () => {
    readToken()
        .then(getMe)
        .then( res => {
            console.dir(res)
            return
        })
        .then(() => {
            const queryParams = {'limit': 1}
            return getProgrammingRedditPosts(queryParams)
        })
        .then( res => {
            console.dir(res)
            return
        })
        .catch( err => {
            if (err.error === 401) {
                return rebuildToken()
                    .then(getProgPosts)
            }
            console.log('error')
            console.dir(err)
        })

}

getProgPosts()

module.exports = getProgrammingRedditPosts
