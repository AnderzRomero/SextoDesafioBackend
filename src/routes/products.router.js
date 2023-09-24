import { Router } from "express";
import productsManager from "../dao/mongo/managers/productsManager.js";
import uploader from "../services/uploadService.js";

const router = Router();
const productsService = new productsManager();

// EndPoint para traer todos los productos
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort || 'asc';
  const category = req.query.category || null; // Capturar el parámetro "category"
  const status = req.query.status || null;     // Capturar el parámetro "status"

  // Construir un objeto de consulta en función de los parámetros proporcionados
  const queryObject = {};

  if (category) {
    queryObject.category = category; // Agregar filtro por categoría si se proporciona
  }

  if (status) {
    queryObject.status = status; // Agregar filtro por estado si se proporciona
  }

  const products = await productsService.getProductsPaginated(limit, page, queryObject, sort);

  res.send({ status: "success", payload: products });

});

// EndPoint para traer producto por ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productsService.getProductBy({ _id: pid });
  if (!product) {
    res.status(400).json({ message: "Producto no encontrado" });
  } else {
    res.send({ status: "success", payload: product })
  }

});

// EndPoint para crear producto 
router.post("/", uploader.array('thumbnail'), async (req, res) => {
  const {
    title,
    description,
    category,
    code,
    stock,
    price
  } = req.body;
  // validamos que todos los campos esten llenos
  if (!title || !description || !category || !code || !stock || !price) return res.status(400).send({ status: "error", error: "Valores incompletos" });

  const newProduct = {
    title,
    description,
    category,
    code,
    stock,
    price
  }
  const thumbnail = req.files.map(file => `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/img/${file.filename}`);
  newProduct.thumbnail = thumbnail

  const result = await productsService.addProduct(newProduct);
  res.send({ status: "success", payload: result._id });
});

// EndPoint para Actualizar producto por ID
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  const {
    title,
    description,
    category,
    stock,
    price,
    status
  } = req.body;

  const updateProduct = {
    title,
    description,
    category,
    stock,
    price,
    status
  }

  const product = await productsService.getProductBy({ _id: pid });
  if (!product) return res.status(400).send({ status: "error", error: "Producto no encontrado" });
  await productsService.updateProduct(pid, updateProduct);
  res.send({ status: "success", message: "Producto Actualizado" });
});

// EndPoint para eliminar producto por ID
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  const product = await productsService.getProductBy({ _id: pid });
  if (!product) return res.status(400).send({ status: "error", error: "Producto no encontrado" });
  await productsService.deleteProduct(pid)
  res.send({ status: "success", message: "Producto eliminado" });
});

export default router;
