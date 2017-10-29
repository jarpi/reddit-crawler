const redditClient = require('./lib/redditSdk.js')

const getProgPosts = () => {
    redditClient.readToken()
        .then(() => {
            const queryParams = {'limit': 1}
            return redditClient.getProgrammingRedditPosts(queryParams)
        })
        .then( res => {
            console.dir(res)
            return
        })
        .catch( err => {
            if (err.error === 401) {
                return redditClient.rebuildToken()
                    .then(getProgPosts)
            }
            console.log('error')
            console.dir(err)
        })

}

getProgPosts()
