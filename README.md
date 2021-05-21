# RedisDB con NodeJs

Contenido
- [Api Rest](#api-rest)
    - [Cliente Redis](#cliente-redis)
    - [Endpoints](#endpoints) 
- [Dockerizando](#dockerizando)
    - [Dockerfile](#dockerfile)

### Api Rest
Las dependencias para levantar la Api Rest con Node, son:
```json
"dependencies": {
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "node-redis-scan": "^1.3.1",
    "redis": "^3.1.2",
    "uuid": "^8.3.2"
  }
```
#### Cliente Redis

Primero se conecta a la base de datos creando un cliente de redis de la siguiente manera

```js
var redis = require('redis');
Connector._redis = redis.createClient("6379", "35.223.156.4");
Connector._redis.select(_config.redis.db,function(err,resp){
    //console.log(resp);
});
```

A continuación se definen los endpoints utilizados.

#### Endpoints

- Nuevo registro en Redis

En el endpoint se llama a la función ```add_register```

```js
app.post('/nuevoRegistro', function (req, res, next) {

    var body = req.body;

    func.add_register(body, function (response, code) {
        resp(res, response, code, next)
    })

});
```

La función ```add_register``` contiene lo siguiente

```js
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
}
```

Y por último, la función ```add_set``` la cual inserta el registro en la base de datos

```js
add_set: function (dset,callback){
    this._client.hset('registros', dset.key, JSON.stringify(dset.data),function(err,data){
        if(err) return callback(err);
        else{
            return callback(true);
        }
    });
}
```

- Eliminar todos los registros en Redis

En el endpoint se llama a la función ```delete_all```

```js
app.get('/deleteAll', function (req, res, next){
    func.delete_all(function (response, code){
        resp(res, response, code, next)
    });
});
```

La función ```delete_all``` contiene lo siguiente

```js
delete_all: function(callback){
    redis.delete_all(function(resp){
        if (resp){
            return callback({err: false, response: "Registros eliminados! "}, 200);
        }else{
            return callback({err: true, response: "No se ha encontrado registros"}, 404);
        }
    })
}
```

Y por último, la función ```delete_all``` la cual elimina todos los registros en la base de datos

```js
delete_all: function(callback){
        this._client.flushall(function(err, reply){
            if(err) return false;
            else
                return callback(reply);
        });
    }
```

- Obtener todos los registros de Redis

Este endpoint es básico para poder graficar y llenar las tablas solicitadas con lo registrado en la base de datos.

En el endpoint se llama a la función ```get_all```

```js
app.get('/obtenerUsuarios', function (req, res, next) {
    func.get_all(function (response, code){
        resp(res, response, code, next)
    })
});
```

La función ```get_all``` contiene lo siguiente

```js
get_all: function(callback){
    redis.get_all(function(resp){
        if(resp){
            return callback({err: false, response: "Registros encontrados", data: resp}, 200);
        }else{
            return callback({err: true, response: "No se ha encontrado registros", data: null}, 404);
        }
    })
}
```

Y por último, la función ```get_all``` la cual recupera todos los datos en la base de datos

```js
get_all: function(callback){
    this._client.hvals('registros', function(err, data){
        if(err) {
            return false}
        else{
            let array = JSON.parse(JSON.stringify(data));
            var res = [];
            for(var i = 0; i < array.length; i++){
                res.push(JSON.parse(array[i]));
            }
            return callback(res);
        }
    });
}
```

### Dockerizando
Para colocar la Api y el servicio de base de datos RedisDB en un contenedor cada uno, se creó un archivo Dockerfile para la Api de NodeJs y se bajó una imagen pública de Redis DB para la base de datos.

#### Dockerfile

Se especifica que el servicio es de Node y se obtiene la última versión. Se especifica el directorio de trabajo para NodeJs. Se copian los dos archivos JSON donde están especificadas todas las dependencias necesarias para la API a la raíz del contenedor. Se corre el comando ```npm install``` para que instale las dependencias. Se copian todos los archivos de raíz a raíz del contenedor. Se expone el puerto 8080, que es donde se va a exponer la API. Por último, se levanta la Api con ```node index.js```.

```dockerfile
FROM node:latest
WORKDIR /usr/src/nodejs
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7019

CMD ["node", "index.js"]
```
