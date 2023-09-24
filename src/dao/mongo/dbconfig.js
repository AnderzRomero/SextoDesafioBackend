import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Con esta estan espuestas las Credentiales ya que esta la conexion directa sin seguridad
const URL = `mongodb+srv://coder:ander1234@cluster0.9vhlkqi.mongodb.net/ecommerce?retryWrites=true&w=majority`;


// con esta linea se encrypta las credenciales de la base de datos 
// const URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.9vhlkqi.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000, })
    .then(() => console.log("Base de datos conectada con exito"))
    .catch(e => console.log(e));







