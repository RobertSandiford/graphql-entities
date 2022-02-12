
const { GraphQLClient : GraphQlClient, gql } = require('graphql-request')
const { formatInputData } = require('./funcs')


// do a regex replace
function parseTypeToRequest(typesRegistry, type) {

    const symbolFindingRegex = /(?<={.*?)([a-zA-Z_]+\s*:\s*[a-zA-Z_\[\]!]+)(?=.*?})/sg
    
    const output = type.replace(symbolFindingRegex, x => {
        
        const parts = x.split(":")
        //console.log("parts len", parts.length)
        const name = parts[0].trim()
        const type = parts[1]
            .replace('[', '').replace(']', '')
            .replace('!', '').trim()

        if ( type in typesRegistry ) {
            return name + ' ' + parseTypeToRequest(
                typesRegistry, typesRegistry[type])
        } else {
            return name
        }
    })

    return output

   
}


function generateFunction(requests, objects, type, name, format) {
    
    const r = async (input, requestedData = '', explain = false) => {
        
        input = formatInputData(input)
        //requestedData = formatInputData(requestedData)

        if (requestedData === '') {
            let returnType = format.split(":").slice(-1).pop().trim()

            returnType = returnType.replace('!', '')

            if ( returnType in objects.typesRegistry ) {
                requestedData = parseTypeToRequest(
                    objects.typesRegistry,
                    objects.typesRegistry[returnType])
            } else {
                requestedData = returnType
            }
        }

        const args = (input) ? `(${input})` : ''

        const query = gql`${type} {
            ${name} ${args} ${requestedData}
        }`
        
        if (explain) console.log('graphql-entities generated query: ', query)

        if ( ! 'graphQlRequest' in requests ) { 
            throw 'graphql-entities requests error - no graphQlRequest function - use requests.configure(url)'
        }
        try {
            const response = await requests.graphQlRequest(query)
            return response[name]
        } catch (e) {
            console.log("graphql-entities request error", e)
        }
    }

    return r
}


module.exports = function (objects) {

    const requests = {}

    requests.configure = (url) => {
        const graphQlClient = new GraphQlClient(url, { headers: {} })
        const graphQlRequest = graphQlClient.request.bind(graphQlClient)
        //requests.graphQlClient = graphQlClient
        requests.graphQlRequest = graphQlRequest
    }


    for ( const queryFormat of objects.queries ) {

        const queryName = queryFormat.split(' ').splice(0, 1).pop()
        const queryResolver = objects.queryResolvers[queryName]

        const r = generateFunction(requests, objects, 'query', queryName, queryFormat)

        requests[queryName] = r
    }

    for ( const mutationFormat of objects.mutations ) {
        
        const mutationName = mutationFormat.split(' ').splice(0, 1).pop()
        const mutator = objects.mutators[mutationName]

        const r = generateFunction(requests, objects, 'mutation', mutationName, mutationFormat)

        requests[mutationName] = r
    }

    return requests
}


module.exports.parseTypeToRequest = parseTypeToRequest
module.exports.generateFunction = generateFunction