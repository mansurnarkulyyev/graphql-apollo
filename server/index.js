const express = require('express');
const colors =require('colors');
require('dotenv').config();

const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema');
const connectDB = require('./config/db')
const port = process.env.PORT || 5000;

const app = express();

//connect to Database 
connectDB();

app.use('/graphql', graphqlHTTP({
  schema: schema,
//   rootValue: root,
  graphiql: process.env.NODE_ENV === 'development',
}));

app.listen(port, console.log(`Server OK running on port ${port}`))