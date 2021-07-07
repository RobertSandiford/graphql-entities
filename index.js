const { ApolloServer } = require('apollo-server-express')
const fs = require("fs")

module.exports = function graphqlEntities(app, graphData) {

    const { typeDefs, resolvers, requests }
        = require('./graphqlSchemaBuilder')(graphData)

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    })
    apolloServer.applyMiddleware({app})

    return requests

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
