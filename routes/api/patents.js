import Joi from 'joi';
import couch from '../../config/db.js';
import request from 'request';
import rp from 'request-promise';

let db = couch+'trafyco_blackbox/_find';

const getPatents = [{ // OBTENER TODAS LAS PATENTES 
    method: 'GET',
    path: '/api/getPatents',
    handler: function(request, reply) {

      let options = {
        method: 'POST',
        uri: db, // mango query
        body: {
          "selector": {
            "type": "patents"
          },
          "fields": [
            "patents"
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
        if (data.docs[0]) {
          return reply(data.docs[0].patents);
        }
      })
      .catch(function (err) {
          throw err;
      });

    }
}];

export default getPatents;