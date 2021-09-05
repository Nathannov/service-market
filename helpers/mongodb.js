var mongoose = require('mongoose');
var db = mongoose.connection;
var fs = require('fs');
var models = {};
const CURRENT_ENV = process.env.NODE_ENVIRONMENT || 'development';
var environment = global.config[CURRENT_ENV];

class MongoDB {

    constructor() {
        fs.readdirSync(__dirname.replace('helpers', 'models')).forEach(function (file) {
            var moduleName = file.split('.')[0];
            models[moduleName] = require(__dirname.replace('helpers', 'models') + '/' + moduleName);
        });

        // If Mongoose gave up trying to reconnect, kill the process.
        db.on('reconnectFailed', () =>
            process.nextTick(() => {
                throw new Error('Mongoose could not reconnect to MongoDB server');
            })
        );

        db.once('open', () =>
            console.debug("Connection successfully to mongo database " + environment.db_database)
        );

        let uri;

        if (CURRENT_ENV == "development") {
            uri = 'mongodb://' + environment.db_host + '/' + environment.db_database;
        } else {
            uri = `mongodb+srv://${environment.tab_db_user}:${environment.tab_db_password}@${environment.db_host}/${environment.db_database}`
        }

        console.log({ CURRENT_ENV });
        console.log({ uri });

        mongoose.connect(uri, {
            useNewUrlParser: true
        });
        mongoose.Promise = global.Promise;
    }

    async saveItem(collection, data) {
        return await models[collection](data).save();
    };

    searchDistinct = function(collection, params, field, callback) {
        models[collection].find(params).distinct(field).exec(function(err, orderDocs) {
            if (err) {
                return callback(err, []);
            }
            return callback(null, orderDocs);
        });
    }
}

module.exports = new MongoDB();