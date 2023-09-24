import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productsManager.js";
import cartManager from "../dao/mongo/managers/cartsManager.js";

const router = Router();
const productsService = new ProductManager();
const cartsService = new cartManager();

// router.get("/", async (req, res) => {
//   // const listaProductos = await productsService.getProducts();
//   res.render("home");
// });

router.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const sort = req.query.sort || 'asc';
  const category = req.query.category || null;
  const status = req.query.status || null;

  const queryObject = {};

  if (category) queryObject.category = category;
  if (status) queryObject.status = status;

  const products = await productsService.getViewsProducts(limit, page, queryObject, sort);

  res.render('Products', {
    user:req.session.user,
    filterProducts: products.filterProducts,
    page: products.page,
    hasPrevPage: products.hasPrevPage,
    hasNextPage: products.hasNextPage,
    prevPage: products.prevPage,
    nextPage: products.nextPage,
    totalPages: products.totalPages
  });
});

router.get('/carts/:cid', async (req, res) => {
  const carrito_id = req.params.cid;
  const filter = { _id: carrito_id }; // Crea un objeto de filtro con el campo "_id" y el valor del ID
  const cart = await cartsService.getCartById(filter);

  res.render('Carts', { cart });
});


router.get("/realTimeProducts", async (req, res) => {
  const listaProductos = await productsService.getProducts();
  res.render("realTimeProducts", { listaProductos });
});

router.get("/messages", (req, res) => {
  res.render("messages");
});

// rutas para el sistema de login 

router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('profile', { user: req.session.user });
})

router.get('/register', async (req, res) => {
  res.render('register')
})

router.get('/login', async (req, res) => {
  res.render('login')  
})

export default router;
