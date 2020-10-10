import nodemailer  from "nodemailer";

export const sendEmail = async (to: string, html: string) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: "s6risa6w62exzj3m@ethereal.email", 
            pass: "nc4e3q47ns3npUpYKz", 
        },
        tls: {rejectUnauthorized: false}
    });

    let info = await transporter.sendMail({
        from: '"Me" <me@me.com>', 
        to,    
        subject: "Change password", 
        html, 
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

}