
const { capitalizeFirstLetter } = require('./funcs')

module.exports = function (input) {

    const scalars = input.scalars || {}
    //const types = input.types || {}
    //const inputs = input.types || {}
    //const queries = input.queries || {}
    //const mutations = input.mutations || {}
    const entities = input.entities || {}

    const schemaTypes = []
    const schemaTypesRegistry = {}
    const schemaInputs = []
    const schemaScalars = []
    const schemaResolvers = {}
    const schemaQueries = []
    const schemaQueryResolvers = {}
    const schemaMutations = []
    const schemaMutators = {}


    for ( const scalarName in scalars ) {
        const scalarResolver = scalars[scalarName]
        schemaScalars.push(`scalar ${scalarName}`)
        schemaResolvers[scalarName] = scalarResolver
    }

    for ( const [entityName, entityData] of Object.entries(entities) ) {

        if ( entityData.type !== undefined ) {
            schemaTypes.push(`type ${entityName} ${entityData.type}`)
            schemaTypesRegistry[entityName] = entityData.type
        }
        // add resolver

        if ( entityData.types !== undefined ) {
            for ( const [typeName, type] of Object.entries(entityData.types) ) {
                schemaTypes.push(`type ${typeName} ${type}`)
                schemaTypesRegistry[typeName] = type
            }
            // add resolver
        }

        if ( entityData.input !== undefined ) {
            const typeName = `${entityName}Input`
            schemaInputs.push(`input ${typeName} ${entityData.input}`)
            schemaTypesRegistry[typeName] = entityData.input
        }
        // add resolver
        if ( entityData.inputType !== undefined ) {
            const typeName = `${entityName}Input`
            schemaTypes.push(`type ${typeName} ${entityData.inputType}`)
            schemaTypesRegistry[typeName] = entityData.inputType
        }
        // add resolver

        if ( entityData.inputs !== undefined ) {
            for ( const [inputName, input] of Object.entries(entityData.inputs) ) {
                schemaInputs.push(`input ${inputName} ${input}`)
                schemaTypesRegistry[inputName] = entityData.input
            }
            // add resolver
        }
        if ( entityData.inputTypes !== undefined ) {
            for ( const [inputName, inputType] of Object.entries(entityData.inputTypes) ) {
                schemaInputs.push(`input ${inputName} ${inputType}`)
                schemaTypesRegistry[inputName] = entityData.inputType
            }
            // add resolver
        }

        if ( entityData.typeResolver !== undefined ) {
            schemaResolvers[entityName] = entityData.typeResolver
        }

        if ( entityData.queries !== undefined ) {

            const queries = entityData.queries

            if ( queries.types !== undefined ) {
                for ( const [typeName, type] of Object.entries(queries.types) ) {
                    schemaTypes.push(`type ${typeName} ${type}`)
                    schemaTypesRegistry[typeName] = type
                }
                // add resolver
            }

            for ( const [queryName, query] of Object.entries(queries) ) {
                schemaQueries.push(`${queryName} ${query.format}`)
                schemaQueryResolvers[queryName] = query.resolver

                if ( query.inputType !== undefined ) {
                    const typeName = `${capitalizeFirstLetter(queryName)}Input`
                    schemaTypes.push(`type ${typeName} ${query.inputType}`)
                    schemaTypesRegistry[typeName] = query.inputType
                }
                // add resolver
                if ( query.responseType !== undefined ) {
                    const typeName = `${capitalizeFirstLetter(queryName)}Response`
                    schemaTypes.push(`type ${typeName} ${query.responseType}`)
                    schemaTypesRegistry[typeName] = query.responseType
                }
                // add resolver
                if ( query.types !== undefined ) {
                    for ( const [typeName, type] of Object.entries(query.types) ) {
                        schemaTypes.push(`type ${typeName} ${type}`)
                        schemaTypesRegistry[typeName] = type
                    }
                    // add resolver
                }
            }
        }

        if ( entityData.mutations !== undefined ) {

            const mutations = entityData.mutations

            if ( mutations.types !== undefined ) {
                for ( const [typeName, type] of Object.entries(mutations.types) ) {
                    schemaTypes.push(`type ${typeName} ${type}`)
                    schemaTypesRegistry[typeName] = type
                }
                // add resolver
            }

            for ( const [mutationName, mutation] of Object.entries(mutations) ) {
                schemaMutations.push(`${mutationName} ${mutation.format}`)
                schemaMutators[mutationName] = mutation.mutator

                if ( mutation.inputType !== undefined ) {
                    const typeName = `${capitalizeFirstLetter(mutationName)}Input`
                    schemaTypes.push(`type ${typeName} ${mutation.inputType}`)
                    schemaTypesRegistry[typeName] = mutation.inputType
                }
                // add resolver
                if ( mutation.responseType !== undefined ) {
                    const typeName = `${capitalizeFirstLetter(mutationName)}Response`
                    schemaTypes.push(`type ${typeName} ${mutation.responseType}`)
                    schemaTypesRegistry[typeName] = mutation.responseType
                }
                // add resolver
                if ( mutation.types !== undefined ) {
                    for ( const [typeName, type] of Object.entries(mutation.types) ) {
                        schemaTypes.push(`type ${typeName} ${type}`)
                        schemaTypesRegistry[typeName] = type
                    }
                    // add resolver
                }
            }
        }
    }

    //function objectConcat (o, prelim = '') {
    //    return Object.entries(o)
    //        .map( ([k, v]) => ((prelim) ? `prelim ` : ``) + `${k} ${v}\n` )
    //        .join('')
    //}

    let typeDefs
    typeDefs = schemaScalars.map(x => `${x}\n`).join('')
    typeDefs += schemaTypes.map(x => `${x}\n`).join('')
    //typeDefs += Object.entries(schemaTypes).map( ([k, v]) => `type ${k} ${v}\n` ).join('')
    //typeDefs += objectConcat(schemaTypes)
    typeDefs += schemaInputs.map(x => `${x}\n`).join('')
    if (schemaQueries.length > 0) {
        typeDefs += `type Query {\n`
        typeDefs += schemaQueries.map(x => `    ${x}\n`).join('')
        typeDefs += `}\n`
    } else {
        typeDefs += `type Query\n` // this doesn't work, but it does at least cause a clear error for users
    }
    if (schemaMutations.length > 0) {
        typeDefs += `type Mutation {\n`
        typeDefs += schemaMutations.map(x => `    ${x}\n`).join('')
        typeDefs += `}\n`
    } else {
        typeDefs += `type Mutation\n` //  this doesn't work, but it does at least cause a clear error for users
    }


    const resolvers = {
        ...schemaResolvers,
        /*Query : schemaQueryResolvers,
        Mutation : schemaMutators,*/
    }
    if ( Object.keys(schemaQueryResolvers).length > 0 ) {
        resolvers.Query = schemaQueryResolvers
    }
    if ( Object.keys(schemaMutators).length > 0 ) {
        resolvers.Mutation = schemaMutators
    }

    //console.log(typeDefs)
    //console.log(resolvers)

    const graphObjects = {
        types : schemaTypes,
        typesRegistry : schemaTypesRegistry,
        inputs : schemaInputs,
        scalars : schemaScalars,
        resolvers : schemaResolvers,
        queries : schemaQueries,
        queryResolvers : schemaQueryResolvers,
        mutations : schemaMutations,
        mutators : schemaMutators
    }

    const requests = require('./graphqlRequestsMaker')(graphObjects)

    return { typeDefs, resolvers, requests }

}