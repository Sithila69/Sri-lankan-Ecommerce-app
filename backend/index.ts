import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./src/routes/products";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
