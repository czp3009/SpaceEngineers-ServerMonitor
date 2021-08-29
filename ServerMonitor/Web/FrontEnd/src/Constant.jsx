const isProd = process.env.NODE_ENV === "production"

export default class {
    static isDev = !isProd

    static baseUrl = isProd ? "/api" : "http://localhost:5000/api"
}
