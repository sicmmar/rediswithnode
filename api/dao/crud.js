var redis = require('../libraries/Redis');

var App = {

    add_register: function (data, callback) {
        var id = Date.now().toString();
        let extract = {
            name: data.name,
            location: data.location,
            gender: data.gender,
            age: data.age,
            vaccine_type: data.vaccine_type,
            way: data.way
        };

        redis.add_set({key: id, data: extract}, function (resp) {
            if (resp){
                return callback({err: false, response: "Registro agregado"}, 200);
            }else{
                return callback({err: true, response: "No se ha podido realizar el registro"}, 400);
            }
        })
    },

    get_register: function (data, callback) {
        redis.get_set({"id": data.id}, null, function (resp) {
            if (resp){
                return callback({err: false, response: "Registro encontrado", data: resp}, 200);
            }else{
                return callback({err: true, response: "No se ha encontrado el registro", data: null}, 404);
            }
        })

    },

    get_all: function(callback){
        redis.get_all(function(resp){
            if(resp){
                return callback({err: false, response: "Registros encontrados", data: resp}, 200);
            }else{
                return callback({err: true, response: "No se ha encontrado registros", data: null}, 404);
            }
        })
    },

    update_register: function (id, data, callback) {
        redis.add_set({key: {"id": id}, data: data}, function (resp) {
            if (resp){
                return callback({err: false, response: "Registro actualizado!"}, 200);
            }else{
                return callback({err: true, response: "No se ha podido actualizar el registro"}, 400);
            }
        })
    },

    delete_register: function (data, callback) {
        redis.delete_set({"id": data.id}, function (resp) {
            if (resp){
                return callback({err: false, response: "Registro eliminado! "}, 200);
            }else{
                return callback({err: true, response: "No se ha encontrado registro"}, 404);
            }
        })

    },

    delete_all: function(callback){
        redis.delete_all(function(resp){
            if (resp){
                return callback({err: false, response: "Registros eliminados! "}, 200);
            }else{
                return callback({err: true, response: "No se ha encontrado registros"}, 404);
            }
        })
    }

};

module.exports = App;