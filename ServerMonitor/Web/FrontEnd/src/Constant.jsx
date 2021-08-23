let isDev = process.env.NODE_ENV !== "production"
let baseUrl = "/api"
if (isDev) baseUrl = "http://localhost:5000/api"

export default class {
    static isDev = isDev

    static baseUrl = baseUrl
}
