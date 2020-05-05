module.exports = {
    find(collection, query, options) {
        return new Promise((resolve, reject) => {
            collection.find(query, options).toArray((err, docs) => {
                if (err) return reject([err, null]);
                resolve([null, docs]);
            })
        })
    },
    findOne(collection, query, options) {
        return new Promise((resolve, reject) => {
            collection.findOne(query, options, (err, doc) => {
                if (err) return reject([err, null]);
                resolve([null, doc]);
            })
        })
    },
    insertOne(collection, doc, options) {
        return new Promise((resolve, reject) => {
            collection.insertOne(doc, options, (err, doc) => {
                if (err) return reject([err, null]);
                resolve([null, null]);
            })
        })
    },
    deleteOne(collection, doc, options) {
        return new Promise((resolve, reject) => {
            collection.deleteOne(doc, options, (err, doc) => {
                if (err) return reject([err, null]);
                resolve([null, null]);
            })
        })
    },
    updateOne(collection, query, update, options) {
        return new Promise((resolve, reject) => {
            collection.updateOne(query, update, options, (err, doc) => {
                if (err) return reject([err, null]);
                resolve([null, null]);
            })
        })
    },
};

