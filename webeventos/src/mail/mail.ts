import * as nodemailer from "nodemailer";
import config from './configs';

class Mail {

    constructor(
        public to?: string,
        public subject?: string,
        public message?: string) { }


    sendMail() {

        const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.password
            },
        });

        transporter.sendMail({
            from: "Nome <email>",
            to: this.to,
            subject: this.subject,
            html: this.message
        }).then(message => {
            console.log(message);
        }).catch(err => {
            console.log(err);
        });
    }
}

export default new Mail;