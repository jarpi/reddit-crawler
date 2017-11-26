const request = require('request')

const sendRequest = ( opts ) => {
    console.dir(opts)
    const userAgent ='Linux/UbuntuX64:reddit_nodejs_bot:v0.1 (by /u/'+ process.env.BOT_USERNAME +')'
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

module.exports = sendRequest
