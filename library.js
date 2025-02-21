//library.js
require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoURI=process.env.MONGO_URI;
const dbname="library";
async function main(){
    //creating a mongodb client
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    try{
        await client.connect();
        console.log('connected to MongoDB Atlas');
        //accesing the database
        const db=client.db(dbname);
        //access the books i already added to the collection
        const booksCollection=db.collection('books');
        //1.retrieving all books
        const allBooks= await booksCollection.find({}).toArray();
        console.log('All books are ',allBooks);
        //2.Query boosk based on a specific book
        const author=await booksCollection.find({author:'chinua achebe'}).toArray();
        console.log('books by chinua achebe:',author);
        //3.books published after 200
        const Rbooks=await booksCollection.find({publishedYear:{$gt:2000}}).toArray();
        console.log('the books published before after 2000:',Rbooks);
        //4.update the publishedYear of a specfic book
        await booksCollection.updateOne({title:'things fall apart'},{$set:{publishedYear:1963}});
        console.log('updated the publication year for the book thinsg fall apart');
        //5.add  field called rating to all the books
        await booksCollection.updateMany({},{$set:{rating:8.9}});
        console.log('added rating to all the books');
        //6.delete a book by its isbn
        await booksCollection.deleteOne({isbn:978-0977772});
        console.log('deleted a book by the isbn');
        //7.remove all books of a particular genre
        await booksCollection.deleteMany({genre:'fiction'});
        console.log('removed all fiction books');
        //8.data modelling
        const usersCollection = db.collection('users');
        const ordersCollection = db.collection('orders');
        const productsCollection = db.collection('products');
        await usersCollection.insertOne({ username: 'user1', email: 'user1@example.com' });
        await productsCollection.insertOne({ productName: 'Product A', price: 29.99 });
        await ordersCollection.insertOne({ userId: 'user1', productId: 'Product A', quantity: 1 });
        console.log('Created collections for users, orders, and products');
        //9.aggregation pipeline
        const genreCount = await booksCollection.aggregate([
            { $group: { _id: '$genre', count: { $sum: 1 } } }
        ]).toArray();
        console.log('Total number of books per genre:', genreCount);
        //10.average published year
        const AvgYear=await booksCollection.aggregate([{$group:{_id:null,avgYear:{$avg:'$publishedYear'}}}]).toArray();
        console.log('avearege published year of all the books',AvgYear);
        //11.the top rated book
        const topRated=await booksCollection.find().sort({rating:-1}).limit(1).toArray();
        console.log('the top rated book is :',topRated);
        //12.indexing 
        await booksCollection.createIndex({author:1});
        console.log('created an index for on author field');
    }catch(error){
        console.error('An error has occured',error);
    }finally{
        await client.close();
    }
}
//running the main function
main().catch(console.error);