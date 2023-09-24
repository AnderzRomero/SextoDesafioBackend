import passport from "passport";
import local from 'passport-local';
import GithubStrategy from 'passport-github2';

import UserManager from "../dao/mongo/managers/usersManager.js";
import auth from "../services/auth.js";


// Estrategia local = registro y login 
const LocalStrategy = local.Strategy; // local = username + password

const usersServices = new UserManager();

const initializeStrategies = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {

        const { firstName, lastName, age } = req.body;
        if (!firstName || !lastName || !age) return done(null, false, { message: "Valores incompletos" })

        const hasedPassword = await auth.createHash(password);
        const newUser = { firstName, lastName, email, age, password: hasedPassword }
        const result = await usersServices.create(newUser);

        done(null, result);

    }))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {

        if (!email || !password) return done(null, false, { message: "Valores incompletos" });

        const user = await usersServices.getBy({ email });
        if (!user) return done(null, false, { message: "Credenciales Incorrectas" });
        const isValidPassword = await auth.validatePassword(password, user.password);
        if (!isValidPassword) return done(null, false, { message: "Credenciales Incorrectas" });

        done(null, user);

    }))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.47994dddd59e9f0e',
        clientSecret: 'c07df5b4bf34171576817394190b1424b2f3b45b',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        const { email, name } = profile._json;

        const user = await usersServices.getBy({ email });
        if (!user) {
            const newUser = {
                firstName: name,
                email,
                password: ''
            }
            const result = await usersServices.create(newUser);
            done(null, result);
        } else {
            done(null, user);
        }
    }))


    passport.serializeUser((user, done) => {
        return done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersServices.getBy({ _id: id });
        done(null, user);
    })


}

export default initializeStrategies;