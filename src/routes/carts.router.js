import { Router } from "express";
import cartManager from "../dao/mongo/managers/cartsManager.js";
import productsManager from "../dao/mongo/managers/productsManager.js";
import __dirname from "../utils.js";
import cartModel from "../dao/mongo/models/cart.model.js";

const router = Router();
const cartService = new cartManager();
const productService = new productsManager();

router.get("/", async (req, res) => {
  const carts = await cartService.getCarts();
  if (carts.length === 0) {
    res.status(200).json({ message: "No hay carros creados" });
  } else {
    res.status(200).json({ carts });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartService.getCartById({ _id: cid });
  if (!cart) {
    res.status(400).json({ message: "Carrito no encontrado" });
  } else {
    res.send({ status: "success", payload: cart })
  }
});

router.post("/", async (req, res) => {
  const cart = await cartService.addCart();
  if (cart) {
    res.status(201).json({ message: "Carrito creado", cart });
  } else {
    res.status(400).json({ message: "Error al crear carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  // Vamos a ver si existen y traer sus entidades
  const product = await productService.getProductBy({ _id: pid });
  if (!product) return res.status(400).send({ status: "error", error: "Producto no existe" });
  const cart = await cartService.getCartById({ _id: cid });
  if (!cart) return res.status(400).send({ status: "error", error: "Carrito no existe" });

  cart.products.push({
    _id: pid,
    quantity: 10
  })
  await cartModel.updateOne({ _id: cid }, { $set: { products: cart.products } });
  res.send({ status: "success", message: "Producto agregado al carro" });
})

router.put('/:cid', async (req, res) => {
  const carrito_id = req.params.cid;
  const nuevosProductos = req.body.products;

  try {
    const carritoActualizado = await cartService.updateCartWithProducts(carrito_id, nuevosProductos);
    res.status(200).json({ status: "success", message: "Carrito actualizado con nuevos productos", cart: carritoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const nuevaCantidad = req.body.quantity;

  try {
    const carritoActualizado = await cartService.updateProductQuantity(cid, pid, nuevaCantidad);
    res.status(200).json({ status: "success", message: "Cantidad de producto actualizada en el carrito", cart: carritoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  const carrito_id = req.params.cid;

  try {
    const carritoActualizado = await cartService.deleteAllProductsInCart(carrito_id);
    res.status(200).json({ status: "success", message: "Todos los productos del carrito fueron eliminados", cart: carritoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const carritoActualizado = await cartService.removeProductFromCart(cid, pid);
    res.status(200).json({ status: "success", message: "Producto eliminado del carrito", cart: carritoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
