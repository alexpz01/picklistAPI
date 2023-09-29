const nodemailer = require("nodemailer")

class Mail {

    static #mailer = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port : 465,
        secure : true,
        auth : {
            user : "PicklistUserConfirmation@gmail.com",
            pass : "ckxvcrawbioafxlt"
        }
    })

    #mailOptions = {
        from : process.env.MAIL_NAME,
        to : "",
        subject : "",
        text : "",
        html : ""
    }

    constructor(to, subject, text) {
        this.#mailOptions.to = to
        this.#mailOptions.subject = subject
        this.#mailOptions.html = text
    }

    // send a confirmation email
    send() {
        const promise = new Promise((resolve, reject) => {
            Mail.#mailer.sendMail(this.#mailOptions, (error, info) => {
                if (error) {
                    reject(error)
                    return false
                }

                resolve(info)
            })
        })
        return promise
    }

    static confirmationBodyMail(url) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
            <header style="background-color: rgb(218, 218, 218); padding: 20px 20px;">
                <h1 style="font-style: italic; margin: 0; font-weight: 200;">PICK<span style="color: white; margin-left: 5px; padding: 0px 8px; background-color: #af0a34;">LIST</span></h1>
            </header>
            <table style="width: 80%; margin: 100px auto;">
                <tbody>
                    <tr style="width: 100%;">
                        <td style="text-align: center;"><p>Para confirmar su cuenta haga click en el siguiente botón</p></td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 0; text-align: center;">
                            <div style="background-color: #af0a34; width: fit-content; margin: 0 auto;">
                                <a href="${url}" style="display: block; padding: 4px 30px; width: fit-content; text-decoration: none;" >
                                    <p style="width: fit-content; color: white;">Confirmar</p>
                                </a>
                            </div>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        
        </body>
        </html>`
    }

   


}

module.exports = Mail