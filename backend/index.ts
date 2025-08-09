import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./src/routes/product-routes";
import userRoutes from "./src/routes/user-routes";
import ListingRoutes from "./src/routes/listings-routes";
import categoriesRoutes from "./src/routes/categories-routes";
import ServicesRoutes from "./src/routes/services-routes";
import CustomerRoutes from "./src/routes/customer-routes";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/listings", ListingRoutes);
app.use("/categories", categoriesRoutes);
app.use("/services", ServicesRoutes); // Assuming services are handled in the same route
app.use("/customers", CustomerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
