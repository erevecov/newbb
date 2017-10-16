import Joi from 'joi';
import nodemailer from 'nodemailer';

const alertEmail = [{
    method: 'POST',
    path: '/api/alertEmail',
    config: { 
        auth: false,
        handler: (request, reply) => {
            let subject = request.payload.subject;
            let to = request.payload.to;
            let body = request.payload.body;
            let patent = request.payload.patent;

            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: "eduardorevecovillalobos@gmail.com",
                        pass: "jm22067890"
                    }
                });

                let mailOptions = {
                    from: `support@blackbox.land`, // sender address
                    to: `${to}`, // list of receivers
                    subject: `${subject}`, // Subject line
                    text: `${body}`, // plaintext body
                    html: `<b>${body}</b>` // html body
                }

                transporter.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                        return reply(error)
                    }else{
                        console.log("Message sent: " + response.message);
                        return reply({subject, to, body})
                    }

                    // if you don't want to use this transport object anymore, uncomment following line
                    //smtpTransport.close(); // shut down the connection pool, no more messages
                });  
        },
        validate: {
            payload: Joi.object().keys({
                subject: Joi.string(),
                to: Joi.string(),
                body: Joi.string(),
                patent: Joi.string()
            })
        }
    
    }
}];

export default alertEmail;