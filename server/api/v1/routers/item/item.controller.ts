import { Request, Response } from "express";
import { ObjectId } from "mongoose";

import { Item } from "../../interfaces/item.interface";

import { ItemService } from "../../services/item.service";

export class ItemController {

  static async createItem(req: Request, res: Response) {
    const token: string = req.body.token;
    const itemInfo: Item<any> = req.body.itemInfo;

    const Item = new ItemService(token, null, itemInfo);

    const data = await Item.createItemInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });

  };

  static async updateItem(req: Request, res: Response) {
    const token: string = req.body.token;
    const id: string = req.params.id;
    const itemInfo: Item<any> = req.body.itemInfo;

    const Item = new ItemService(token, id, itemInfo);

    const data = await Item.updateItemInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  static async deleteItem(req: Request, res: Response) {
    const token: string = req.body.token;
    const id: string = req.params.id;
    
    const Item = new ItemService(token, id, null);

    const data = await Item.deleteItemInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

};