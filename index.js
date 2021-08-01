const axios = require('axios')
const {Pool} = require('pg')

const config = {
    server: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "repertorio"
}

const pool = new Pool(config)

const agregarCancion = async (cancion) => { //cancion es un objeto, es el payload de la solicitud POST
    pool.connect(async (error_conexion, cliente, liberar) => {
        if (error_conexion) return console.log(error_conexion)
        //obtener los valores de la cancion como arreglo
        const valoresCancion = Object.values(cancion)
        // console.log(valoresCancion)

        const textoInsercion = 
        `INSERT INTO repertorio(cancion, artista, tono)
        VALUES($1, $2, $3) RETURNING *`

        try {
            const insercion = await cliente.query(textoInsercion, valoresCancion)
            // console.log(insercion.rows)
        } catch (error_consulta) {
            console.log(error_consulta)
        }
        liberar()
        // pool.end()
    })
}

//la funcion que obtiene las canciones necesariamente debe retornar los datos obtenidos
//de la base de datos SQL, por esto la haremos con una promesa
const obtenerCanciones = () => {
    return new Promise ((resolve, reject) => {
        pool.connect(async (error_conexion, cliente, liberar) => {
            if (error_conexion) reject(error_conexion)
            try {
                const {rows: obtencion} = await cliente.query("SELECT * FROM repertorio")
                resolve(obtencion) //devuelve un arreglo de objetos con los registros
                //nota para mi mismo: las promesas continuan su ejecucion despues de resolver/rechazar
            } catch (error_consulta) { 
                reject(error_consulta)
            }
            liberar()
            // pool.end()
        })
    })
}

const editarCancion = (cancion) => {
    pool.connect(async (error_conexion, cliente, liberar) => {
        if (error_conexion) return console.log(error_conexion)
        const valoresCancion = Object.values(cancion)
        console.log(valoresCancion)
        const textoEdicion = `UPDATE repertorio SET cancion = $2,  artista = $3, tono = $4 WHERE id=$1 RETURNING *;`
        
        try {
            const edicion = await cliente.query(textoEdicion, valoresCancion)
            console.log(edicion.rows)
        } catch (error_consulta) {
            console.log(error_consulta)
        }
        liberar()

    })
}

const borrarCancion = async (id) => {
    pool.connect(async (error_conexion, cliente, liberar) => {
        if (error_conexion) return console.log(error_conexion)
        try {
            const borracion = await cliente.query(`DELETE FROM repertorio WHERE id = $1 RETURNING *`, [id])
            console.log("Registro borrado: ", borracion.rows)
        } catch (error_consulta) {
            console.log(error_consulta)
        }
        liberar()

    })

}
module.exports = {agregarCancion, obtenerCanciones, editarCancion, borrarCancion}