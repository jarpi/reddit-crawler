const getDataByPath = ( data, path, acc ) => {
    return resolveObj(data, path)
    .reduce(uniqueElements, [{}, acc])
    .concat(acc)
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

const uniqueElements = ( obj, element, i, arr ) => {
    if (!obj[1][element]) obj[0][element] = true
    return (i>=arr.length-1 ? Object.keys(obj[0]) : obj)
}

module.exports = getDataByPath
