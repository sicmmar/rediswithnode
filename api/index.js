const express = require('express');
const cors = require('cors');
const config = require('./config/config')
const func = require('./dao/crud')

const app = express();

var resp = function (res, data, code, next) {
    res.status(code).json(data);
    return next();
};

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '5mb', extended: true }));

app.listen(config.init_port);

console.log("Aplicación corriendo en el puerto ", config.init_port);

app.get('/', (req, res) => {
    res.send('API para redisDB :D');
});

app.post('/nuevoRegistro', function (req, res, next) {

    var body = req.body;

    func.add_register(body, function (response, code) {
        resp(res, response, code, next)
    })

});

app.get('/obtenerUsuarios', function (req, res) {
    func.get_all(function (response, code){
        resp(res, response, code, next)
    })
});

app.get('/deleteAll', function (req, res){
    func.delete_all(function (response, code){
        resp(res, response, code, next)
    });
});