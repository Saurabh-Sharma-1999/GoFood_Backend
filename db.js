const mongoose = require("mongoose");
require('dotenv').config()


const dbUrl = process.env.MONGO_URL;

main().then( () => {
    console.log("Connection established successfully");
    const collection =  mongoose.connection.db.collection("food_items");
    collection.find({}).toArray().then( async(data) => {   //.toArray() is chained to the find() method to convert the cursor to an array of documents
        const foodCategory =  mongoose.connection.db.collection("foodCategory");
        foodCategory.find({}).toArray().then((catData) => {
            global.food_items = data;
            global.foodCategory = catData;
            
        })
        
        
        
    })
       
   
}).catch((err) => {
    console.error("Error connecting to the database:", err);
});

async function main() {
    await mongoose.connect(dbUrl);
    
}



module.exports = main;
