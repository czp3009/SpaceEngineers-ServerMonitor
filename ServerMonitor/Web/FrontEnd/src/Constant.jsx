const isProd = process.env.NODE_ENV === "production"

export default class {
    static isDev = !isProd

    static baseUrl = isProd ? "/apis" : "http://localhost:5000/api"
}
