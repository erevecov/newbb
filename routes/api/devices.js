import Joi from 'joi';
import couch from '../../config/db.js';
import request from 'request';
import rp from 'request-promise';
import moment from 'moment';

//let db = cloudant.db.use("blackbox");
let db = couch+'trafyco_devices/_find';

const devices = [{//Obtiene la configuracion de los dispositivos
    method: 'POST',
    path: '/api/getDevice',
    config: {
        handler: (request, reply) => {
            let patent = request.payload.patent;

            var options = {
                method: 'POST',
                uri: db, // mango query
                body: {
                    "selector": {
                        "type": "device",
                        "patent": patent
                    },
                    "fields": [],
                    "sort": []
    
                },
                json: true
            };
            
            rp(options)
            .then(function (data) {
                return reply(data.docs);
            })
            .catch(function (err) {
                throw err;
            });

        },
        validate: {
            payload: Joi.object().keys({
                patent: Joi.string()
            })
        }
    }
},{//Obtiene todos los camiones =O!
    method: 'GET',
    path: '/api/getUserX',
    handler: function(request, reply) {

        var options = {
            method: 'POST',
            uri: db, // mango query
            body: {
                "selector": {
                    "type": "user"
                },
                "fields": ["_id","_rev", "name","lastname"],
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
{ 
//elimina device ////////////////////////
    method: 'DELETE',
    path: '/api/deleteDevice',
    config: {
        handler: (request, reply) => {
            let id = request.payload.PrimaryID;
            let rev = request.payload.PrimaryRev;

            var options = {
                method: 'DELETE',
                uri: couch+'trafyco_blackbox/'+id+'?rev='+rev, // base de datos + id del documento + ?rev= revision del documento
                resolveWithFullResponse: true 
            };
            
            rp(options)
            .then(function (data) {
                console.log(data.body)
                return reply(JSON.parse(data.body));
            })
            .catch(function (err) {
                throw err;
            });

        },
        validate: {
            payload: Joi.object().keys({
                PrimaryID: Joi.string(),
                PrimaryRev: Joi.string()
            })

        }
    }
},
{ 
    //creacion documento patents////////////////////////
    method: 'POST',
    path: '/api/createDevice',
    config: {
        handler: (request, reply) => {
            let test = JSON.parse(request.payload.test);
            
            // INSERT
            var options = {
                method: 'PUT',
                uri: couch+'trafyco_blackbox/'+moment().format('YYYY-MM-DDTHH:mm:ss.SSSSS'), 
                body: test,
                json: true 
            };
            
            rp(options)
            .then(function (data) {
                return reply(data);
            })
            .catch(function (err) {
                throw err;
            });

        },
        validate: {
            payload: Joi.object().keys({
                test: Joi.string()
            })
        }
    }
}];

export default devices;