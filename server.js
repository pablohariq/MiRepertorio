const http = require('http')
const fs = require('fs')
const url = require('url')
const {agregarCancion, obtenerCanciones, editarCancion, borrarCancion} = require('./index')

http
.createServer(async (req, res) => {
    if (req.url == "/"){
        const html = fs.readFileSync('./index.html', 'utf-8')
        res.writeHead(200, {'Content-type': 'text/html'})
        res.end(html)
    }
    //ruta POST
    if (req.url.startsWith("/cancion") && req.method == "POST"){
        let body = ""
        req.on("data", (chunk) => {
            body += chunk
        })
        req.on("end", async () => {
            await agregarCancion(JSON.parse(body))
            res.statusCode = 201;
            res.end()
        })
    }
    if (req.url.startsWith("/canciones") && req.method == 'GET'){
        const repertorio = await obtenerCanciones()
        res.writeHead(200, {'Content-type': 'Application/json; charset=utf-8'})
        res.end(JSON.stringify(repertorio))
    }

    if (req.url.startsWith("/cancion") && req.method == 'PUT'){
        let body = ""
        req.on("data", (chunk) => {
            body += chunk
        })
        req.on("end", () => {
            editarCancion(JSON.parse(body))
            res.statusCode = 200
            res.end()
        })
    }
    if (req.url.startsWith("/cancion") && req.method == 'DELETE'){
        const id = url.parse(req.url, true).query.id
        await borrarCancion(id)
        res.statusCode = 204
        res.end()
    }


})
.listen(3000, () => console.log("Servidor levantado en el puerto 3000"))