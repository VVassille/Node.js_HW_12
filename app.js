import express from "express";
import dotenv from "dotenv";
import { connectDB, getDB } from "./db/index.js";
import { ObjectId } from "mongodb";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST - Create new product
app.post("/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const newProduct = {
      name,
      price,
      description,
    };

    const db = getDB();

    const result = await db.collection("products").insertOne(newProduct);

    res.status(201).json({
      message: "Product created successfully",
      product: {
        _id: result.insertedId,
        ...newProduct,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
});
// GET - Get all products
app.get("/products", async (req, res) => {
  try {
    const db = getDB();

    const products = await db.collection("products").find({}).toArray();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
});
// GET - Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const db = getDB();

    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
});
// PUT - Update product
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const db = getDB();

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          price,
          description,
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
});
// DELETE - Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const db = getDB();

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
});
// Start server after successful MongoDB connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
