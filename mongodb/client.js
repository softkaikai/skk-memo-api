const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});

client.connect((err) => {
    if (err) return console.log('mongodb connect failed:');
    console.log('mongodb connect succeed:');
});

module.exports = client;
