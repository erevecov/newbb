import Joi from 'joi';
import couch from '../../config/db.js';
import request from 'request';
import rp from 'request-promise';

let db  = couch+'trafyco_blackbox/_find';
let dbG = couch+'trafyco_devices/_find';

const logTemps = [{ 
    //creacion de un usuario ////////////////////////
    method: 'POST',
    path: '/api/Logstempssssss',
    config: {
        handler: (request, reply) => {
            let nombre = request.payload.nombre1;
            let apellido = request.payload.apellido1;
            let pass = request.payload.pass1;
            let email = request.payload.Email1;
            let cargo = request.payload.cargo1;


            var options = {
                method: 'POST',
                uri: db, // mango query
                body: {
                    "selector": {
                        "type": "user",
                        "email": email
                    },
                    "fields": ["_id"],
                    "sort": [{
                        "_id": "desc"
                    }]
                },
                json: true
            };
            
            rp(options)
            .then(function (data) {
                if (data.docs != "") {
                    console.log("Existe")
                    console.log(data.docs)
                    return reply("Existe");
                    
                } else {

                    // INSERT
                    let action = {
                        'type':"user",
                        'email': email,
                        'password': pass,
                        'name' : nombre,
                        'lastname': apellido,
                        'state': true,
                        'userType': cargo
                    };

                    var options = {
                        method: 'PUT',
                        uri: couch+'trafyco_blackbox/'+email, // base de datos + id del documento
                        body: action,
                        json: true 
                    };

                    rp(options)
                    .then(function (data) {
                        return reply(data);
                    })
                    .catch(function (err) {
                        throw err;
                    });

                }
            })
            .catch(function (err) {
                throw err;
            });

        },
        validate: {
            payload: Joi.object().keys({
                nombre1: Joi.string().allow(''),
                apellido1: Joi.string().allow(''),
                pass1: Joi.string().allow(''),
                Email1: Joi.string().email(),
                cargo1: Joi.string().allow('')
            })
        }
    }
},
{//consultar por camiones viajando
    method: 'GET',
    path: '/api/patentz',
    handler: function(request, reply) {

        var options = {
            method: 'POST',
            uri: db, // mango query
            body: {
                "selector": {
                    "type": "patents"
                    
                },
                "fields": ["_id","_rev", "patents"],
                "sort": [{
                    "_id": "desc"
                }]
            },
            json: true
        };
        
        rp(options)
        .then(function (data) {
            if (data.docs) {
                return reply(data.docs);
            }
        })
        .catch(function (err) {
            throw err;
        });

    }
}

,
{//consultar por camiones viajando
    method: 'GET',
    path: '/api/GetTemps',
    handler: function(request, reply) {

        var options = {
            method: 'POST',
            uri: dbG, // mango query
            body: {
                "selector": {
                    "type": "temperature",
                    "patent": "JP4467"
                    
                },
                "fields": ["_id", "temperature"],
                "sort": [{
                    "_id": "desc"
                }]
            },
            json: true
        };
        
        rp(options)
        .then(function (data) {
            if (data.docs) {
                return reply(data.docs);
            }
        })
        .catch(function (err) {
            throw err;
        });
        
    }
},
{//Obtiene la configuracion de los dispositivos
    method: 'POST',
    path: '/api/TempLeida2',
    config: {
        handler: (request, reply) => {
            let patent = request.payload.patent;
            let initDate = request.payload.initDate;
            let endDate = request.payload.endDate;
            //console.log (patent)


            var options = {
                method: 'POST',
                uri: dbG, // mango query
                body: {
                    "selector": {
                        "_id": {
                          "$gte": initDate,//"2017-04-17T15:47:12",
                          "$lte": endDate//"2017-04-17T16:02:07"
                        },
                        "type": "temperature",
                        "patent": patent
                        
                    },
                    "fields": ["_id", "temperature", "latitude", "longitude"],
                    "sort": [{
                        "_id": "asc"
                    }],
                    "limit": 1000,
                    "skip":2
                },
                json: true
            };
            
            rp(options)
            .then(function (data) {
                if (data.docs) {
                    return reply(data.docs);
                }
            })
            .catch(function (err) {
                throw err;
            });
        },
        validate: {
            payload: Joi.object().keys({
                patent: Joi.string(),
                initDate: Joi.string(),
                endDate: Joi.string()
            })
        }
    }
},
{//consultar por camiones viajando
    method: 'GET',
    path: '/api/LogViajes',
    handler: function(request, reply) {

        var options = {
            method: 'POST',
            uri: db, // mango query
            body: {
                "selector": {
                    "type": "travel"
                    
                },
                "fields": [],
                "sort": [{
                    "_id": "desc"
                }]
            },
            json: true
        };
        
        rp(options)
        .then(function (data) {
            if (data.docs) {
                return reply(data.docs);
            }
        })
        .catch(function (err) {
            throw err;
        });
    }
}
];

export default logTemps;