var Connector = require('./Connector');
var redis_scan = require('node-redis-scan');

var Redis = {
    _client: Connector.Redis(),

    _key_generator: function(data){
        var keys = Object.keys(data);
        return keys[0]+':'+data[keys[0]];
    },

    add_set: function (dset,callback){
        var key = this._key_generator(dset.key);
        this._client.hmset(key,dset.data,function(err,data){
            if(err) return callback(err);
            else{
                return callback(true);
            }
        });
    },

    get_set: function(key, field,callback){
        var keygen = this._key_generator(key);
        this._client.hgetall(keygen, function(err,data){
            if(err) return false;
            else {
                if (field) {
                    data = data.field;
                }
                return callback(data);
            }
        });
    },

    delete_set: function(key,callback){
        this._client.del(this._key_generator(key),function(err,reply){
            if(err) return false;
            else
                return callback(reply);
        });
    },

    delete_all: function(callback){
        this._client.flushall(function(err, reply){
            if(err) return false;
            else
                return callback(reply);
        });
    },

    get_all: function(callback){
        const scanner = new redis_scan(this._client);
        scanner.hscan('id', '*', (err, data) =>{
            console.log(err + " *********** : " + data);
            if(err) {
                return false}
            else
                return callback(data);
        });
    }
};

module.exports = Redis;