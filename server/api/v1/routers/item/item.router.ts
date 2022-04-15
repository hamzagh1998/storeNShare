import { Router } from "express";

import { ItemController } from "./item.controller";

import { errorHandler } from "../../utils";

const ItemRouter = Router();

ItemRouter.post('/create', errorHandler(ItemController.createItem));
ItemRouter.put('/update/:id', errorHandler(ItemController.updateItem));
ItemRouter.delete('/delete/:id', errorHandler(ItemController.deleteItem));

export { ItemRouter };