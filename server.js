//configurando o servidor
const express = require("express") //pegar de dentro do node_modules o express
const server = express()


//configurar o servidor para apresentar arquivos estáticos(css,imagem,script.js)
server.use(express.static('public'))



//habilitar body do formulário
server.use(express.urlencoded({extended: true}))


//configurar a conexão com o banco de dados;

const mysql = require('mysql')
const con = mysql.createConnection({
    user: 'root',
    password: '',
    host: 'localhost',
    port: 3306,
    database:'doe'
})




//configurando a template engine(permite usar variaveis no index.html)
const nunjucks = require("nunjucks")
nunjucks.configure("./", {    // "./"" é a raiz do projeto 
    express: server,
    noCache: true //não ficar buscando valores na cache
})









//configurar a apresentação da página
server.get("/", function(req,res) {
   
        con.query("SELECT * FROM donors;", function(err, resultado) {
        if (err) return res.send("Erro de banco de dados")
        
        return res.render("index.html", {donors:resultado})
    })
})






//receber dados do formulário
server.post("/", function(req , res) {
    //pegar dados do formulário
    const nome = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (nome == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }


    //colocar valores dentro do banco de dados
    const query = "INSERT INTO `donors` (`nome`,`email`,`blood`) VALUES ('"+nome+"', '"+email+"', '"+blood+"');"

    con.query(query, function(err){
        //fluxo de erro
        if (err) return res.send("Erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })


})







//ligando o servidor (porta 3000)
server.listen(3000, () => console.log("iniciando o servidor"))

