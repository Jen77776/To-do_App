const { app } = require('@azure/functions');
const { ObjectId } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;

app.http('getTodos', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'todo',
    handler: async (request, context) => {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
        const todos = await client.db("todo-db").collection("todos").find({}).toArray()
        client.close();
        return {
            jsonBody: {data: todos}
        }
    },
});

app.http('getTodo', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'todo/{id}',
    handler: async (request, context) => {
        const id = request.params.id;
        if (ObjectId.isValid(id)) {
            const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
            const todo = await client.db("todo-db").collection("todos").findOne({_id: new ObjectId(id)})
            client.close();

            if (todo) {
                return {
                    jsonBody: {todo: todo}
                }
            }
        }
        return {
            status: 404,
            jsonBody: {error: "No todo found with that ID"}
        }
    },
});

app.http('updateTodo', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'todo/{id}',
    handler: async (request, context) => {
        const id = request.params.id;
        const body = await request.json();
        const { title, description, completed,category } = body;
        
        if (ObjectId.isValid(id)) {
            const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
            const result = await client.db("todo-db").collection("todos").updateOne(
              {_id: new ObjectId(id)}, 
              {$set: { title, description, completed,category }}
            );
            client.close();
            if (result.matchedCount > 0) {
                return {
                    jsonBody: {status: "ok"}
                }
            }            
        }
        return {
            status: 404,
            jsonBody: {error: "No todo found with that ID"}
        }
    },
});

app.http('createTodo', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'todo',
    handler: async (request, context) => {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
        const body = await request.json();
        const { title, description, completed = false,category } = body;
        const newTodo = { title, description, completed,category};
        
        const result = await client.db("todo-db").collection("todos").insertOne(newTodo);
        client.close();
        
        return {
            status: 201, /* Defaults to 200 */
            jsonBody: { _id: result.insertedId, ...newTodo }
        };
    },
});

