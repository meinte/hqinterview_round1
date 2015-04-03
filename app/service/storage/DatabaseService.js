//a small abstraction layer, unfinished, add any db service requirements here and call as necessary
//this should be a generic storage layer, and main interface storage points are 'init' and 'store'
//TODO: expand on this idea and write storage specific, for now a storage object can simply be passed to a model class
//to store its data
function DatabaseService() {
    this.config = require('../../model/core/config.js');
    this.mongoClient = require('mongodb').MongoClient;
    this.db = null;
}

DatabaseService.prototype.init = function(callback) {
    var that = this;
    this.mongoClient.connect(this.config.connectionString, function(err, database) {
        that.db = database;
        callback(err, database);
    });
}

DatabaseService.prototype.store = function(object, collection,callback) {
    if (!this.db) throw new Error("No database");
    var collection = this.db.collection(collection);
    collection.insert(object,callback);

}

module.exports = DatabaseService;
