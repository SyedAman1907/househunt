const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function testEmail() {
    console.log("--- Email Configuration Test ---");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "**** (HIDDEN)" : "MISSING!");
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your_email@gmail.com') {
        console.error("ERROR: You have not updated your .env file with real credentials!");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    console.log("Attempting to connect to Gmail SMTP...");
    try {
        await transporter.verify();
        console.log("SUCCESS: Connection to SMTP server established!");
        
        console.log("Sending test email to yourself...");
        const info = await transporter.sendMail({
            from: `"HouseHunt Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: "HouseHunt Email Test",
            text: "If you are reading this, your email configuration is working correctly!"
        });
        console.log("SUCCESS: Test email sent! Message ID:", info.messageId);
    } catch (error) {
        console.error("FAILURE: Error occurred:");
        console.error(error);
        if (error.code === 'EAUTH') {
            console.error("\nTIP: This is an Authentication Error. Possible reasons:");
            console.error("1. The App Password is wrong.");
            console.error("2. 2-Step Verification is not enabled on your Google account.");
            console.error("3. You are using your normal password instead of an App Password.");
        }
    }
}

testEmail();
