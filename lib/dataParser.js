const getDataByPath = ( data, path, acc ) => {
    return resolveObj(data, path)
    .concat(acc)
    .reduce(uniqueElements, [{}])
    .reduce(toArray, null)
}

const resolveObj = ( obj, path ) => {
    const key = path[0]
    if(!key) return obj
    if (Array.isArray(obj)) return resolveArray(obj, path, key)
    return resolveObj(obj[key], path.slice(1,path.length))
}

const resolveArray  = ( obj, path, key ) => {
    return obj.map( item => {
        return resolveObj(item[key], path.slice(1, path.length))
    })
}

const uniqueElements = ( obj, element ) => {
    if (!obj[0][element]) obj[0][element] = true
    return obj
}

const toArray = ( _, obj) => {
    return Object.keys(obj)
}

module.exports = getDataByPath
