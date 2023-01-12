// const {projects, clients} = require('../userData.js');

//Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

// const graphql = require('graphql');
// graphql.GraphQLObjectType

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} = require('graphql');

//Project Type
const ProjectType =  new GraphQLObjectType({
    name:'Project',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        status:{type:GraphQLString},
        client:{
            type:ClientType,
            resolve(parent, args){
                // return clients.fin(client => client.id === parent.clientId);
                return Client.findById(parent.clientId);
            },
        },
    }),
});

//Client Type
const ClientType =  new GraphQLObjectType({
    name:'Client',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        phone:{type:GraphQLString},
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        projects:{
            type: new GraphQLList(ProjectType),
            resolve(parent,args){
                return Project.find();
            },
        },
        project:{
            type:ProjectType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                // return projects.find(project => project.id === args.id)
                return Project.findById(args.id); 
            },
        },
        clients:{
            type: new GraphQLList(ClientType),
            resolve(parent,args){
                return Client.find();
            },
        },
        client:{
            type:ClientType,
            args:{id:{type:GraphQLID}},
            resolve(parent, args){
                // return clients.find(client => client.id === args.id)
                return Client.findById(args.id);
            }
        }
    }
});

//Mutations
const mutation = new GraphQLObjectType({
     name:'Mutation',
     fields:{
        //add client
        addClient:{
            type:ClientType,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                phone:{type:GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                const client = new Client({
                    name:args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return client.save();
                // Client.create({})
            },
        },
        //Delete a client
        deleteClient:{
            type:ClientType,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                return Client.findByIdAndRemove(args.id);
            },
        },

        //add project
        addProject:{
            type:ProjectType,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                description:{type:GraphQLNonNull(GraphQLString)},
                status:{
                    type:new GraphQLEnumType({
                        name:'ProjectStatus',
                        values:{
                            'new':{value:'Not Started'},
                            'progress':{value:'In Progress'},
                            'completed':{value:'Completed'},
                        }
                    }),
                    defaultValue:'Not Started',
                },
                clientId:{type:GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                const project = new Project({
                    name:args.name,
                    description: args.description,
                    status: args.status,
                    clientId:args.clientId,
                });
                return project.save();
            },
        },
     },
});

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation,
})