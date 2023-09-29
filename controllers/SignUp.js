const { Types } = require("mongoose");
const User = require("../models/User");
const Database = require("./Database");
const Mail = require("./Mail");
const Token = require("./Token");

class SignUp {

    #name;
    #user;
    #mail;
    #password;

    constructor({name, user, mail, password}) {
        this.#name = name
        this.#user = user
        this.#mail = mail
        this.#password = password

    }

    comprobeParameters() {
        if (!this.#name || !this.#user || !this.#mail || !this.#password) {
            return false
        }
        else return true
    }

    // check that mail and user are not in use when registering
    trySignUp() {
        const promise = new Promise((resolve, reject) => {

            if (!this.comprobeParameters()) {
                reject("Faltan parametros en la solicitud")
                return false
            }

            Database.userExists(this.#user).then((exists) => {
                if (!exists) {
                    Database.mailExists(this.#mail).then((exists) => {
                        if (!exists) {
                            this.signUp().then(() => {
                                resolve(true)
                            }).catch((error) => {
                                reject(error)
                            })
                        } else {
                            reject("El email ya esta en uso")
                        }
                    })
                } else {
                    reject("El usuario ya existe")
                }
            })
        })
        return promise;
    }


    signUp() {  
        const promise = new Promise(async (resolve, reject) => {

            const userId = new Types.ObjectId().toHexString()

            await this.sendConfirmationMail(userId).then(() => {
                this.createUser(userId).then(() => {
                    resolve()
                }).catch(() => {
                    reject("Ha ocurrido un error")
                })
            }).catch((error) => {
                reject("Ha ocurrido un error al enviar el mail")
                return false
            })           
        
        })
        return promise
    }

    sendConfirmationMail(id) {
        const confirmLink = "http://192.168.1.150:5000/api/confirmation/" + Token.createConfirmToken(id)
        const confirmationMail = new Mail(this.#mail, "Confirm your PickList account", 
        Mail.confirmationBodyMail(confirmLink))
        return confirmationMail.send()
    }

    // registers the user in the database
    createUser(id) {
        const newUser = new User(
            {
                _id: id,
                name: this.#name,
                user_name: this.#user,
                mail: this.#mail,
                password: this.#password,
                creation_date: new Date(),
                is_confirmed: false,
                profile_img: "default.png"
            })
        return newUser.save()
    }
    

}

module.exports = SignUp