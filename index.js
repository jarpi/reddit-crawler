const redditClient = require('./lib/redditSdk.js')
const parser = require('./lib/dataParser.js')

const getProgPosts = (after) => {
    return redditClient.getToken()
        .then(() => {
            const queryParams = {'limit': 100}
            if (after) queryParams.after = after
            return redditClient.getProgrammingRedditPosts(queryParams)
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

const getDataUpToDate = (after,acc) => {
  let data = acc || []
  const targetDate  = Date.parse('September 21, 2017')
  getProgPosts(after)
  .then( res => {
    const dataLength = res.data.children.length
    const lastDate = res.data.children[dataLength-1].data.created*1000
    console.dir(new Date(lastDate))
    data = parser(res, ['data', 'children', 'data', 'domain'], data)
    console.dir(data)
    if (lastDate>targetDate && res.data.after !== null) getDataUpToDate(res.data.after, data)
  })
}

getDataUpToDate();
