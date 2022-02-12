
module.exports.buildSchema = function buildSchema(graphData) {

    const schema = require('./graphqlSchemaBuilder')(graphData)
    
    return schema

}

module.exports.requests = function requests(graphData) {

    //const requests = require('./graphqlRequestsMaker')(graphObjects)
    const { requests } = module.exports.buildSchema(graphData)
    
    return requests

}

module.exports.typeDefs = function typeDefs(graphData) {

    const { typeDefs } = module.exports.buildSchema(graphData)
    
    return typeDefs
}

module.exports.resolvers = function resolvers(graphData) {

    const { resolvers } = module.exports.buildSchema(graphData)
    
    return resolvers
}
