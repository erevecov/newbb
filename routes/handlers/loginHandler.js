import Boom from 'boom';
import Joi from 'joi';
import couch from '../../config/db.js';
import request from 'request';
import rp from 'request-promise';

let uuid = 1;
const login = function(request, reply) {

    if (request.auth.isAuthenticated) {
        return reply.redirect('/');
    }

    let message = '';
    let account = {};

    if (request.method === 'post') {
        if (!request.payload.username || !request.payload.password) {
            Boom.expectationFailed('Falta Usuario o Contraseña');
        } else {
            let post_email = request.payload.username;
            let post_password = request.payload.password;

            var options = {
                method: 'POST',
                uri: couch+'trafyco_blackbox/_find', // mango query
                body: {  
                    "selector": {
                        "_id": post_email,
                        "password": post_password
                    },
                    "fields": [
                        "name",
                        "lastname",
                        "_id",
                        "userType"
                    ]
                },
                json: true
            };
            
            rp(options)
            .then(function (data) {
                if(data.docs[0]) {
                    account.name = data.docs[0].name;
                    account.lastname = data.docs[0].lastname;
                    account.email = data.docs[0]._id;
                    account.userType = data.docs[0].userType;
    
                    const sid = String(++uuid);
                    request.server.app.cache.set(sid, { account: account }, 0, (err) => {
    
                        if (err) {
                            Boom.badImplementation(err);
                        }
    
                        request.cookieAuth.set({ sid: sid });
                        return reply.redirect('/home');
                    });
    
                }else {
                    reply.view('login', { error: 'Usuario y/o contraseña no corresponden' }, { layout: false });
                }
            })
            .catch(function (err) {
                throw err;
            });
        }
    }

    if (request.method === 'get') {
        return reply.view('login', { title: 'test' }, { layout: false });
    }
};
export default login;