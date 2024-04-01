const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
