import cartModel from "../models/cart.model.js"

export default class cartManager {
  getCarts = (params) => {
    return cartModel.find(params).lean();
  }

  getCartById = async (cartId) => {
    try {
      const cart = await cartModel.findById(cartId).lean();

      if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);


      return cart;
    } catch (error) {
      throw error;
    }
  }


  addCart = async (products) => {
    try {
      let cartData = {};
      if (products && products.length > 0) {
        cartData.products = products;
      }

      const cart = await cartModel.create(cartData);
      return cart;
    } catch (err) {
      console.error("Error al crear el carrito:", err.message);
      return err;
    }
  }

  // addProductInCart = async (id, newProducts) => {
  //   return cartModel.updateOne({ _id: id }, { $set: newProducts });
  // };

  updateCart = async (cartId, newProducts) => {
    try {
      const existingCart = await cartModel.findById(cartId);
      if (!existingCart) throw new Error(`No se encontró el carrito con ID ${cartId}`);


      existingCart.products = newProducts;

      const updatedCart = await existingCart.save();

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);


      const productToUpdate = cart.products.find((product) =>
        product._id.toString() === productId
      );

      if (!productToUpdate) throw new Error(`No se encontró el producto con ID ${productId} en el carrito`);


      productToUpdate.quantity = quantity;
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  deleteCart = async (cartId) => {
    try {
      const existingCart = await cartModel.findById(cartId);
      if (!existingCart) throw new Error(`No se encontró el carrito con ID ${cartId}`);


      existingCart.products = [];

      const updatedCart = await existingCart.save();

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  deleteAllProductsInCart = async (cartId) => {
    try {
      const existingCart = await cartModel.findById(cartId);
      if (!existingCart) throw new Error(`No se encontró el carrito con ID ${cartId}`);


      existingCart.products = [];

      const updatedCart = await existingCart.save();

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  removeProductFromCart = async (cartId, productId) => {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);

      cart.products = cart.products.filter((product) =>
        product._id.toString() !== productId
      );

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

}