var Connector = require('./Connector');

var Redis = {
    _client: Connector.Redis(),

    _key_generator: function(data){
        var keys = Object.keys(data);
        return keys[0]+':'+data[keys[0]];
    },

    add_set: function (dset,callback){
        this._client.hset('registros', dset.key, JSON.stringify(dset.data),function(err,data){
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
        this._client.hvals('registros', function(err, data){
            if(err) {
                return false}
            else{
                let array = JSON.parse(JSON.stringify(data));
                console.log(array);
                console.log('--------------------------')
                var res = [];
                for(var i = 0; i < array.length; i++){
                    console.log(JSON.parse(array[i]))
                    res.push(JSON.parse(array[i]));
                }
                
                console.log('------------------');
                console.log(res)

                return callback(res);
            }
        });
    }
};

module.exports = Redis;