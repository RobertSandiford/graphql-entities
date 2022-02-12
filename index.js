const { ApolloServer } = require('apollo-server');
const fs = require("fs")

module.exports = function graphqlEntities(graphData) {

    const { typeDefs, resolvers, requests }  = module.exports.buildSchema(graphData)

    const server = new ApolloServer({
        typeDefs,
        resolvers
    })

    return {
        server,
        typeDefs,
        resolvers,
        requests
    }

}

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

module.exports.load = function load(folder, includeIndex = false) {
    let items = {}
    const files = fs.readdirSync(folder)
    for ( const file of files ) {
        if ( ! includeIndex && file !== "index.js" ) {
            items = { ...items, ...require(folder + "/" + file) }
        }
    }
    return items
}
