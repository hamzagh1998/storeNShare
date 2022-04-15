import { Request, Response } from "express";

import { List } from "../../interfaces/list.interface";

import { ListService } from "../../services/list.service";


export class ListController {

    // GET
  // Get all my lists
  static async myLists(req: Request, res: Response) {
    const token: string = req.body.token;
    const collectionId: string = req.body.collectionId;

    const List = new ListService(token, null, collectionId, null);

    const data = await List.myListsInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // GET
  // Get my list detail
  static async myListDetail(req: Request, res: Response) {
    const token: string = req.body.token;
    const collectionId: string = req.body.collectionId;
    const id: string = req.params.id;

    const List = new ListService(token, id, collectionId, null);

    const data = await List.myListDetailInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // GET
  // Get external list detail (only shared ones)
  static async listDetail(req: Request, res: Response) {
    const token: string = req.body.token;
    const id: string = req.params.id;

    const List = new ListService(token, id, null, null);

    const data = await List.listDetailInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // GET
  // save external shared list into my colection
  static async shareList(req: Request, res: Response) {
    const token: string = req.body.token;
    const id: string = req.params.id;
    const collectionId: string = req.body.collectionId;

    const List = new ListService(token, id, collectionId, null);

    const data = await List.shareListInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // POST
  // Create new list
  static async createList(req: Request, res: Response) {
    const token: string = req.body.token;
    const listInfo: List<any> = req.body.listInfo

    const List = new ListService(token, null, null, listInfo);

    const data = await List.createlistInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // PUT
  // Update my list stats (name, shared)
  static async updateList(req: Request, res: Response) {
    const token: string = req.body.token;
    const id: string = req.params.id;
    const listInfo: List<any> = req.body.listInfo;
    
    const List = new ListService(token, id, null, listInfo);

    const data = await List.updateListInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // DELETE
  // Delete my list
  static async deleteList(req: Request, res: Response) {
    const token: string = req.body.token;
    const id: string = req.params.id;

    const List = new ListService(token, id, null, null);

    const data = await List.deleteCollectionInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

};