import { Router } from "express";

import { ListController } from "./list.controller";

import { errorHandler } from "../../utils";

const ListRouter = Router();

ListRouter.get("/my", errorHandler(ListController.myLists));
ListRouter.get("/my/:id", errorHandler(ListController.myListDetail));
ListRouter.get("/:id", errorHandler(ListController.listDetail));
ListRouter.get("/share/:id", errorHandler(ListController.shareList));
ListRouter.post("/create", errorHandler(ListController.createList));
ListRouter.put("/update/:id", errorHandler(ListController.updateList));
ListRouter.delete("/delete/:id", errorHandler(ListController.deleteList));

export { ListRouter };