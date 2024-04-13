const { app } = require('@azure/functions');
const { ObjectId } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;

app.http('getTodos', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'todo',
    handler: async (request, context) => {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
        // 获取并解码 x-ms-client-principal 头
        //const body = await request.json();

       // console.log("body:", body);
       const principalHeader  = request.headers['x-ms-client-principal'];
       console.log("request.headers['x-ms-client-principal']", request.headers['x-ms-client-principal']);
       console.log("header", request.headers);
       if (principalHeader ){
        const buffer = Buffer.from(principalHeader, 'base64');
            const principal = JSON.parse(buffer.toString('utf-8'));
            const userId = principal.userId;
            
            // 打印用户 ID
            console.log("User ID:", userId);
       }
       else{
        console.log("principalHeader is empty");
       }
        const todos = await client.db("todo-db").collection("todos").find({}).toArray()
        client.close();
        return {
            jsonBody: {data: todos}
        }
    },
})

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
        const { title, description, completed = false,category, userId } = body;
        const newTodo = { title, description, completed,category, userId};
        
        const result = await client.db("todo-db").collection("todos").insertOne(newTodo);
        client.close();
        
        return {
            status: 201, /* Defaults to 200 */
            jsonBody: { _id: result.insertedId, ...newTodo }
        };
    },
});

app.http('getCategories', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'categories',
    handler: async (request, context) => {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
        const categories = await client.db("todo-db").collection("categories").find({}).toArray();
        client.close();
        
        // 提取类别名称
        const categoryNames = categories.map(category => category.name);

        return {
            status: 200,
            jsonBody: { categories: categoryNames }
        };
    },
});


app.http('deleteCategory', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'category/{categoryName}',
    handler: async (request, context) => {
        const categoryName = request.params.categoryName;
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);

        // 更新待办事项，将属于该类别的待办事项的类别字段设置为null
        await client.db("todo-db").collection("todos").updateMany(
            { category: categoryName }, 
            { $set: { category: null } }
        );

        // 删除categories集合中的类别
        const deleteResult = await client.db("todo-db").collection("categories").deleteOne(
            { name: categoryName }
        );

        client.close();

        // 检查是否有类别被删除，并返回适当的响应
        if (deleteResult.deletedCount > 0) {
            return {
                status: 200,
                jsonBody: { message: "Category deleted from categories collection and todos updated." }
            };
        } else {
            return {
                status: 404,
                jsonBody: { error: "Category not found in categories collection" }
            };
        }
    },
});


app.http('createCategory', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'category',
    handler: async (request, context) => {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        const { categoryName } = await request.json();

        if (!categoryName || !categoryName.trim()) {
            client.close();
            return {
                status: 400,
                jsonBody: { error: "Category name cannot be empty" }
            };
        }

        // 检查类别是否已存在
        const existingCategory = await client.db("todo-db").collection("categories").findOne({ name: categoryName.trim() });
        if (existingCategory) {
            client.close();
            return {
                status: 400,
                jsonBody: { error: "Category already exists" }
            };
        }

        // 添加新类别
        const result = await client.db("todo-db").collection("categories").insertOne({ name: categoryName.trim() });
        client.close();

        return {
            status: 201,
            jsonBody: { _id: result.insertedId, name: categoryName.trim() }
        };
    },
});
app.http('deleteTodo', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'todo/{id}',
    handler: async (request, context) => {
        const id = request.params.id;
        if (ObjectId.isValid(id)) {
            const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
            const result = await client.db("todo-db").collection("todos").deleteOne({_id: new ObjectId(id)});
            client.close();
            if (result.deletedCount > 0) {
                return {
                    status: 200,
                    jsonBody: { message: "Todo successfully deleted" }
                };
            }
        }
        return {
            status: 404,
            jsonBody: { error: "No todo found with that ID" }
        };
    },
});
