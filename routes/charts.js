import Joi from 'joi';

const charts = {
    method: 'GET',
    path: '/charts',
    config: {
        handler: function(request, reply) {
            let session = request.auth.credentials;
            let credentials = {email: session.email, name: session.name, lastname: session.lastname, role: session.userType};

            
            if (credentials.role == 'Administrador') {
            	return reply.view('charts', {credentials: credentials, admin:'ok'});
            }else{
            	return reply.view('home', {credentials: credentials, error: 'Requiere permisos mas elevados'});
            }
         
        }
    }
};
export default charts;