let settings = {
    mailgun: {
        key: '',
        email: ''
    }
};

try {
    settings = require('../settings.json');
} catch (e) {}

const mailgun = require('mailgun-js')({ apiKey: settings.mailgun.key, domain: settings.mailgun.domain });

class Email {
    static send(to, html) {
        return new Promise((resolve, reject) => {
            if (!to || !html) {
                reject('Wrong fields');
            }

            const data = {
                from: Email.defaultFrom,
                to,
                subject: 'Заказ с сайта GitFood',
                html: Email.doctype + html
            };

            mailgun.messages().send(data, (error, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }
}

Email.defaultFrom = 'GitFood <food@shri.online>';
Email.doctype = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';

module.exports = Email;
