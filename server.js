const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

const privateKey = fs.readFileSync('/etc/letsencrypt/live/klllnolse.ru/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/klllnolse.ru/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/klllnolse.ru/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', (req, res) => {
    const { name, phone, email, comment } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true, // Используем SSL
        auth: {
            user: 'klllnolse@yandex.ru',
            pass: 'qfpcguitaewtklbp',
        },
    });

    const mailOptions = {
        from: 'klllnolse@yandex.ru', // Используем ваш email для отправки
        to: 'klllnolse@yandex.ru', // Ваш email для получения
        subject: `Feedback from ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nComment: ${comment}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error while sending email:', error); // Логи для отладки
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`HTTPS Server running on port ${port}`);
});
