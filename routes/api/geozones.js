import Joi from 'joi';
import couch from '../../config/db.js'; 
import moment from 'moment';
import request from 'request';
import rp from 'request-promise';

let db_geo = couch+'trafyco_geozones/_find';

const geozones = [
/*
    Crear geozona
*/
{
    method: 'POST',
    path: '/api/geozones/newGeo',
    config: {
        handler: (request, reply) => {
            let newPath = request.payload.path;
            let name = request.payload.name;
            let geoType = request.payload.geoType;
            let color = "";
            let toJson = JSON.parse(newPath);
            
            let options = {
                method: 'POST',
                uri: db_geo, // mango query
                body: {
                    "selector": {
                        "type": "geozona",
                        "active": true,
                        "nombre": name
                    },
                    "fields": [
                        "_id"
                    ],
                    "limit": 1
                },
                json: true
            };
            
            rp(options)
            .then(function (data) {
                if( data.docs[0] == undefined ) {

                    if(geoType === "secureZone") {
                        color = "#1abc9c";
                    }else if(geoType === "toll") {
                        color = "#d35400";
                    }else if(geoType === "rest") {
                        color = "#f1c40f";
                    }else if(geoType === "Proveedor") {
                        color = "#9b59b6";
                    }else if(geoType === "Cliente") {
                        color = "#3498db";
                    }
                    
                    var date = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSS'); 
                    // INSERT
                    var obj = {
                        'nombre': name,
                        'type': 'geozona',
                        'patents': [],
                        'geoType': geoType,
                        'geoColor': color,
                        'active': true,
                        'poligono': toJson
                    }
        
                    var options = {
                        method: 'PUT',
                        uri: couch+'trafyco_geozones/'+date, // base de datos + id del documento
                        body: obj,
                        json: true 
                    };
        
                    rp(options)
                    .then(function (data) {
                        obj.id = date;
                        return reply(obj);
                    })
                    .catch(function (err) {
                        throw err;
                    });
                    
                } else {
                    return reply({ error: 'Ya existe esta geozona!' });
                }
                
                //return reply(data.docs[0]);
            })
            .catch(function (err) {
                throw err;
            });
        },
        validate: {
            payload: Joi.object().keys({
                path: Joi.string(),
                geoType: Joi.string(),
                name: Joi.string()
            })
        }
    }
},
/*
    Obtener las patentes dentro de una geozona
*/ 
{
    method: 'POST',
    path: '/api/geozones/patentsInGeo',
    config: {
        handler: (request, reply) => {
            let name = request.payload.name;

            var options = {
                method: 'POST',
                uri: db_geo, // mango query
                body: {
                    "selector": {
                      "nombre": name,
                      "type": "geozona",
                      "active": true
                    },
                    "fields": [
                      "patents"
                    ]
                },
                json: true
            };
            
            rp(options)
            .then(function (data) {
                return reply(data.docs[0].patents);
            })
            .catch(function (err) {
                throw err;
            }); 

        },
        validate: {
            payload: Joi.object().keys({
                name: Joi.string()
            })
        }
    }
},
/*
    Cambiar las patentes autorizadas dentro de una geozona
*/ 
{
    method: 'POST',
    path: '/api/setGeoZonePatents',
    config: {
        handler: (request, reply) => {
            let db_geo = couch+'trafyco_geozones/_find';
            let name = request.payload.name;
            let patents = JSON.parse(request.payload.patents);

            if(patents == null) {
              patents = [];
            }

            var options = {
                method: 'POST',
                uri: db_geo, // mango query
                body: {
                    "selector": {
                      "nombre": name,
                      "type": "geozona",
                      "active": true
                    },
                    "fields": [
                      "_id",
                      "_rev",
                      "nombre",
                      "geoType",
                      "geoColor",
                      "poligono"
                    ]
                },
                json: true
            };
            
            rp(options)
            .then(function (data) {

                var opt = {
                    method: 'PUT',
                    uri: couch+'trafyco_geozones/'+data.docs[0]._id, // base de datos + id del documento
                    body: {
                        '_rev': data.docs[0]._rev,
                        'nombre': name,
                        'geoType': data.docs[0].geoType,
                        'type': 'geozona',
                        'active': true,
                        'geoColor': data.docs[0].geoColor,
                        'patents': patents,
                        'poligono': data.docs[0].poligono
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                
                rp(opt)
                .then(function (data) {
                    return reply(data);
                })
                .catch(function (err) {
                    throw err;
                });

            })
            .catch(function (err) {
                throw err;
            });

        },
        validate: {
            payload: Joi.object().keys({
                name: Joi.string(),
                patents: Joi.string()
            })
        }
    }
},
/*
    Cambiar estado de la geozona a falso (active = false)
*/
{
    method: 'POST',
    path: '/api/geozones/deleteGeo',
    config: {
        handler: (request, reply) => {
            let geoname = request.payload.name;

            var options = {
                method: 'POST',
                uri: db_geo, // mango query
                body: {
                    "selector": {
                      "type": "geozona",
                      "active": true,
                      "nombre": geoname
                    },
                    "fields": [
                      "_id",
                      "_rev",
                      "nombre",
                      "poligono",
                      "active"
                    ]
                },
                json: true
            };
            
            rp(options)
            .then(function (data) {
                console.log(data)
                let result = data;
                if (data.docs[0].active === true) {

                    var opt = {
                        method: 'PUT',
                        uri: couch+'trafyco_geozones/'+data.docs[0]._id, // base de datos + id del documento
                        body: {
                            '_rev': data.docs[0]._rev,
                            'nombre': data.docs[0].nombre,
                            'type': 'geozona',
                            'active': false,
                            'poligono': data.docs[0].poligono
    
                        },
                        json: true // Automatically stringifies the body to JSON
                    };
                    
                    rp(opt)
                    .then(function (data) {
                        return reply(data);
                    })
                    .catch(function (err) {
                        throw err;
                    });

                } else if (data.docs[0].active === false) {
                    return reply({error: "error al eliminar"});
                }
            })
            .catch(function (err) {
                throw err;
            });

        },
        validate: {
            payload: Joi.object().keys({
                name: Joi.string()
            })
        }
    }
}
];

export default geozones;