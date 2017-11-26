const redditClient = require('./lib/RedditSdk.js')
const parser = require('./lib/DataParser.js')

const getProgPosts = (after) => {
		const queryParams = {'limit': 100}
		if (after) queryParams.after = after
		return redditClient.getProgrammingRedditPosts(queryParams)
		.catch( err => {
			console.log('error')
			console.dir(err)
		})
}

const buildUniqueDomainsArrByDate = (after,acc) => {
	let data = acc || []
	const targetDate  = Date.parse('September 21, 2017')
	return getProgPosts(after)
		.then( res => {
			const dataLength = res.data.children.length
			const lastDate = res.data.children[dataLength-1].data.created*1000
			data = parser(res, ['data', 'children', 'data', 'domain'], data)
			if (lastDate>targetDate && res.data.after !== null) return buildUniqueDomainsArrByDate(res.data.after, data)
			return data
		})
}

buildUniqueDomainsArrByDate()
	.then(v=>{console.dir(v)})
