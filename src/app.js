import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";
import "./dao/mongo/dbConfig.js";
import __dirname from "./utils.js"
import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from "passport";
import initializeStrategies from "./config/passport.config.js";


const app = express();
const PORT = process.env.PORT || 8080;

// middlewars
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser("CRYPTO")); 
app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://coder:ander1234@cluster0.9vhlkqi.mongodb.net/ecommerce?retryWrites=true&w=majority",
    ttl: 900
  }),
  secret: 'coderS3cret',
  resave: true,
  saveUninitialized: false
}))

initializeStrategies();
app.use(passport.initialize());

//configuracion de handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

//rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/sessions', sessionRouter);

app.listen(PORT, () =>console.log(`Servidor escuchando en el puerto ${PORT}`));
