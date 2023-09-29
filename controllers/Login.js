const User = require("../models/User");
const Database = require("./Database");

class Login {

    #user;
    #password;
    #responseId;

    constructor({user, password}) {
        this.#user = user
        this.#password = password
    }

    // Comprobe if password is correct and user has confirmed their email
    tryLogin() {
        const response = new Promise((resolve, reject) => {
            Database.userExists(this.#user).then((exists) => {
                if (exists) {
                    this.#validate().then((isCorrect) => {
                        if (isCorrect) {
                            Database.isConfirmed(this.#responseId).then((isConf) => {
                                if (isConf) {
                                    console.log(isConf)
                                    resolve(["La contraseña es correcta", this.#responseId])
                                } else {
                                    reject("Debes confirmar tu email para iniciar sesión")
                                }
                            })
                        } else {
                            reject("La contraseña es incorrecta")
                        }
                    }) 
                } else {
                    reject("El usuario no existe")
                }
            })
        })
        return response
    }

    // Comprobe if password is correct, returns a promise
    #validate() {
        return new Promise((resolve, reject) => {
            const regex = new RegExp(`^(${this.#user})$`, "i")
            User.find({user_name : {"$regex" : regex}}).then((res) => {
                const {_id, password} = res[0]
                if (this.#password == password) {
                    this.#setResponseId(_id)
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        }) 
    }

    #setResponseId(id) {
        this.#responseId = id
    }
}

module.exports = Login