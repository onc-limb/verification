import express from "express";
import { ImageController } from "./image-editing/presentation/controllers/ImageController";
import { createImageRoutes } from "./image-editing/presentation/routes/imageRoutes";

const port = 8888;

const app = express();

// JSONパーサーを追加
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

// 画像APIルートを追加
const imageController = new ImageController();
app.use("/api/images", createImageRoutes(imageController));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
