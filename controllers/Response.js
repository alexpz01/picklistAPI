class Response {

    #responseJSON = {
        status : true,
        result : [],
        fromRequest : {}
    }

    constructor(requestJSON) {
        this.#responseJSON.fromRequest = requestJSON
    }

    addError(error) {
        this.#responseJSON.result.push("ERROR: " + error)
        if (this.#responseJSON.status) {
            this.#responseJSON.status = false
        }
    }

    addResult(result) {  
        if (this.#responseJSON.status) {
            this.#responseJSON.result.push(result)
        }
    }

    setResult(result) {
        if (this.#responseJSON.status) {
            this.#responseJSON.result = result
        }
    }

    getResponse() {
        return this.#responseJSON
    }

}

module.exports = Response