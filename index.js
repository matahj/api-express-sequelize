require("dotenv").config();

////////////////////////////////////////////////
const { Sequelize, DataTypes, json } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

async function connect() {
    try {
        await sequelize.authenticate();
        console.log("Conectado a la BD.")
    } catch (e) {
        console.error("No se puede conectar a la BD.");
        console.error(e);
    }
}

connect();

const Terminal = sequelize.define("terminales",
    {
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

const Autobus = sequelize.define("autobuses",
    {
        matricula: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        modelo: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        anio: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

const Viaje = sequelize.define("viajes",
    {
        asientosDisponibles: {
            field: "asientos_disponibles",
            type: DataTypes.INTEGER,
            validate: { min: 0, max: 40 },
            allowNull: false,
            defaultValue: 40
        },
        fechaSalida: {
            field: "fecha_salida",
            type: DataTypes.DATE,
            allowNull: false,
        },
        precio: {
            type: DataTypes.DOUBLE,
            validate: { min: 0.0, max: 5000.0 },
            allowNull: false,
        }
    }
);

const Administrador = sequelize.define("admins",
    {
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
);

Terminal.hasMany(Autobus);
Autobus.belongsTo(Terminal);

Viaje.belongsToMany(Administrador, {
    through: "viajes_admins"
});
Administrador.belongsToMany(Viaje, {
    through: "viajes_admins"
});

async function sync(){
    try{
        await sequelize.sync();
        //await sequelize.sync({force: true});
        console.log("Base de datoa inicializada.");
    } catch(e){
        console.error("La BD no se pude actualizar.");
        console.error(e);
    }
}

sync();
////////////////////////////////////////////////

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

