const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', (req, res) => {
    const { name, phone, email, comment } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true, // Используем SSL
        auth: {
            user: 'bathedultrapro@yandex.ru',
            pass: 'fsfsrguwqwyubext',
        },
    });

    const mailOptions = {
        from: 'bathedultrapro@yandex.ru', // Используем ваш email для отправки
        to: 'bathedultrapro@yandex.ru', // Ваш email для получения
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
