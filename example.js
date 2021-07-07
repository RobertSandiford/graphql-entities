
const graphqlEntities = require('graphqlEntities')

const scalars = require('./scalars')
const entities = require('./entities')

modul.exports = (app) => {
    const graphqlRequests = graphqlEntities(app, {
        scalars
        entities
    })
    return graphqlRequests
}

//

const graphql = require("./graphql")
const graphqlRequests = graphql(app)

/////


const graphqlEntities = require('graphqlEntities')

const scalars = require('./graph/scalars')
const entities = require('./graph/entities')

const graphqlRequests = graphqlEntities(app, {
    scalars
    entities
})