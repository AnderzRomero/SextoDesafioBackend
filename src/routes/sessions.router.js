import { Router } from "express";
import passport from "passport";

const router = Router();


// EndPoint para crear un usuario y almacenarlo en la Base de Datos
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res) => {
    res.status(200).send({ status: "success", message: "Usuario registrado correctamente", payload: req.user._id });
})

// EndPoint para logearse con el usuario
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res) => {
    req.session.user = req.user;
    res.send({ status: "success", message: "logeado correctamente" });
})

// EndPoints para autenticacion de terceros
router.get('/github', passport.authenticate('github'), (req, res) => { })   //Trigger de mi estartegia de passport
router.get('/githubcallback', passport.authenticate('github'), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
})

//EndPoint para redirigis cualquier error del proceso de autenticacion
router.get('/authFail', (req, res) => {
    res.status(401).send({ status: "error", error: "Error de autenticacion" })
})

// EndPoint para Finalizar la session
router.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
        }
        return res.redirect('/');
    });
})

export default router;