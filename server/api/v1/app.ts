import express, { Request, Response } from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { checkToken } from "./middlewares/check-token"
import { errorCatcher } from "./middlewares/error-catcher";

import { AuthRouter } from "./routers/auth/auth.router";
import { ClusterRouter } from "./routers/cluster/cluster.router";
import { CollectionRouter } from "./routers/collection/collection.router";
import { ListRouter } from "./routers/list/list.router";
import { ItemRouter } from "./routers/item/item.router";

const app = express();

app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"]
    }
  })
);

process.env.NODE_ENV !== "production" && app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "..", "public")));

// Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/cluster", checkToken, ClusterRouter);
app.use("/api/v1/collection", checkToken, CollectionRouter);
app.use("/api/v1/list", checkToken, ListRouter);
app.use("/api/v1/item", checkToken, ItemRouter);

// custom middleware
app.use(errorCatcher);

app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "index.html"));
});

export { app };