require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

app.get("/hola", function(req, res){
    res.send("Hola desde Express");
});

app.get("/goodbye", function(req, res){
    res.send("Goodbye desde Express");
});

app.listen(process.env.PORT_SERVER, function(){
    console.log("Servidor en el puerto " + process.env.PORT_SERVER);
});

