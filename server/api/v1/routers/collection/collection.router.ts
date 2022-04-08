import { Router } from "express";

import { CollectionController } from "./collection.controller";

import { errorHandler } from "../../utils";


const CollectionRouter = Router();

CollectionRouter.get("/my", errorHandler(CollectionController.myCollections));
CollectionRouter.get("/my/:id", errorHandler(CollectionController.myCollectionDetail));
CollectionRouter.get("/:id", errorHandler(CollectionController.collectionDetail));
CollectionRouter.get("/share/:id", errorHandler(CollectionController.shareCollection));
CollectionRouter.post("/create", errorHandler(CollectionController.createCollection));
CollectionRouter.put("/update/:id", errorHandler(CollectionController.updateCollection));
CollectionRouter.delete("/delete/:id", errorHandler(CollectionController.deleteCollection));


export { CollectionRouter };