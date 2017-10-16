import Joi from 'joi';
import couch from '../config/db.js';

import loginHandler      from './handlers/loginHandler';
import logoutHandler     from './handlers/logoutHandler';
import SensorsConfig     from './sensors_config';

// API
import APIGeozones       from './api/geozones';
import APISensors        from './api/sensors';
import APIalertEmail     from './api/alertEmail';
import APIPatents        from './api/patents';
import APIDevices        from './api/devices';

const Login = {
    method: ["GET", "POST"],
    path: "/login",
    config: {
        handler: loginHandler,
        auth: { mode: 'try' },
        plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    }
};

const Logout = {
    method: ["GET", "POST"],
    path: "/logout",
    config: {
        handler: logoutHandler
    }
};

const Home = {
    method: ['GET', 'POST'],
    path: '/home',
    config: {  
        //auth: false,
        handler: function(request, reply) {       
            let session = request.auth.credentials;
            let credentials = {email: session.email, name: session.name, lastname: session.lastname, role: session.userType};

            if (credentials.role == 'Administrador') {
                return reply.view('home', {credentials: credentials, admin:'ok'});    
            } else {
                return reply.view('home', {credentials: credentials});
            }
        
            
        }
    }
};

const Index = {
    method: ['GET', 'POST'],
    path: '/',
    config: { 
        auth: false,
        handler: function(request, reply) {
            return reply.view('index', { title: 'test' }, { layout: false }); 
        }
    }
};

const Public = {
    method: "GET",
    path: "/public/{path*}",
    config: { auth: false },
        handler: {
            directory: {
                path: "./public",
                listing: false,
                index: false
            }
        }
};

const Routes = [].concat(
    Public,
    Home,
    Index,
    Login,
    Logout,
    SensorsConfig,
    APIGeozones,
    APIalertEmail,
    APISensors,
    APIPatents,
    APIDevices
);

export default Routes;