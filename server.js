const http = require("http")
// const server = http.createServer((req,res)=> {
//     res.end(" la réponse du serveur")
// })
// server.listen(process.env.PORT ||  5000 )


const app = require("./app")
const port = process.env.PORT ||  5000
app.set("port" , port ) // non utilisable
const server = http.createServer(app)
server.listen(port , () => {
    console.log("listening on" + port)
})
