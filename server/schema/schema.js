//1-я операция написать типы nameType
//2-я написать в RootQuery 
// const {projects, clients} = require('../userData.js');

//Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

// const graphql = require('graphql');
// graphql.GraphQLObjectType

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType} = require('graphql');

////////

const products = [
{
"id": '1',
"title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
"price": '109.95',
"description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
"category": "men's clothing",
"image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",

},
{
"id": '2',
"title": "Mens Casual Premium Slim Fit T-Shirts ",
"price":' 22.3',
"description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
"category": "men's clothing",
"image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",

},
{
"id": '3',
"title": "Mens Cotton Jacket",
"price": '55.99',
"description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
"category": "men's clothing",
"image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",

},
];

//Movie Type

const ProductType = new GraphQLObjectType({
    name:'Product',
    fields:()=>({
        id:{type:GraphQLString},
        title:{type:GraphQLString},
        price:{type:GraphQLString},
        description:{type:GraphQLString},
        category:{type:GraphQLString},
        category:{type:GraphQLString},
        image:{type:GraphQLString},
    }),
});


////////

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
        product:{//запрос одного фильма
            type:ProductType,
            args:{id:{type:GraphQLString}},
            resolve(parent,args){//какие данные возврашать
             return products.find(product => product.id === args.id);
         },
        },


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
                Project.find({clientId:args.id}).then(
                    (projects)=>{
                        projects.forEach((project)=>{
                            project.remove()
                        })
                    }
                );
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
        //delete project
        deleteProject:{
            type:ProjectType,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)},
            },
            resolve(parent,args){
                return Project.findByIdAndRemove(args.id);
            },
        },
        //update
        updateProject:{
            type:ProjectType,
            args:{
                id:{type:GraphQLNonNull(GraphQLString)},
                name:{type:GraphQLString},
                description:{type:GraphQLString},
                status:{
                    type:new GraphQLEnumType({
                        name:'ProjectStatusUpdate',
                        values:{
                            'new':{value:'Not Started'},
                            'progress':{value:'In Progress'},
                            'completed':{value:'Completed'},
                        }
                    }),
                },
            },
            resolve(parent,args){
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name:args.name,
                            description:args.description,
                            status:args.status,
                        },
                    },
                    {new:true}
                );
            }
        }
     },
});

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation,
})