import Joi from 'joi';
import couch from '../../config/db.js'; 
import request from 'request';
import rp from 'request-promise';

let db = couch+'trafyco_devices/_find';

const sensors = [{
   	method: 'POST',
    path: '/api/movement',
    config: {
        handler: (request, reply) => {
            let patent = request.payload.patent;

            var options = {
                method: 'POST',
                uri: db, // mango query
                body: {
                    "selector": {
                        "type": "movement",
                        "patent": patent,
                        "activity": 1
                    },
                    "fields": [
                        "_id",
                        "latitude",
                        "longitude"
                    ],
                    "sort": [
                        {
                            "_id": "desc"
                        }
                    ]
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
}, { // funcionando
   	method: 'POST',
    path: '/api/temperatures',
    config: {
        handler: (request, reply) => {
            let patent = request.payload.patent;

            var options = {
                method: 'POST',
                uri: db, // mango query
                body: { 
                    "selector": {
                        "_id": {
                            "$gt": null
                        },
                        "type": "temperature",
                        "patent": patent
                    },
                    "fields": [
                        "_id",
                        "temperature",
                        "latitude",
                        "longitude"
                    ],
                    "sort": [
                        {
                            "_id": "desc"
                        }
                    ]
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
}, {
   	method: 'POST',
    path: '/api/betweenTemperatures',
    config: {
        handler: (request, reply) => {
            let patent = request.payload.patent;
            let initDate = request.payload.initDate;
            let endDate = request.payload.endDate;

            console.log(patent);
            console.log(initDate);
            console.log(endDate);
            
            var options = {
                method: 'POST',
                uri: db, // mango query
                body: {
                    "selector": {
                        "_id": {
                          "$gte": initDate,
                          "$lte": endDate
                        },
                        "type": "temperature",
                        "patent": patent
                    },
                    "fields": [
                    ],
                    "sort": [{
                        "_id": "desc"
                    }],
                    "limit": 100
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
            	patent: Joi.string(),
                initDate: Joi.string(),
                endDate: Joi.string()
            })
        }
    }
}];

export default sensors;