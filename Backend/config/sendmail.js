const nodemailer = require('nodemailer');

const sendmail = async(props) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'clementine.cronin69@ethereal.email',
            pass: 'GrSaEnYFN3yuanKukC'
        }
    });

    let message = {
        from: 'Chatapp <chatapp@email.com>',
        to: 'Sainath <sainathreniwad0720@gmail.com>',
        subject: `${props.subject}`,
        text: `${props.text}`,
    };

    transporter.sendmail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

}

module.exports = sendmail;