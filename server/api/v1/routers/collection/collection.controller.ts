import { Request, Response } from "express";

import { Collection } from "../../interfaces/collection.interface";

import { CollectionService } from "../../services/collection.service";


export class CollectionController {

  // GET
  // Get all my collections
  static async myCollections(req: Request, res: Response) {
    const token: string = req.body.token;

    const Collection = new CollectionService(token, null, null);

    const data = await Collection.myCollectionsInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // GET
  // Get my collection detail
  static async myCollectionDetail(req: Request, res: Response) {
    const token: string = req.body.token;
    const collectionId: string = req.params.id;

    const Collection = new CollectionService(token, collectionId, null);

    const data = await Collection.myCollectionDetailInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // GET
  // Get external collection detail (only shared ones)
  static async collectionDetail(req: Request, res: Response) {
    const token: string = req.body.token;
    const collectionId: string = req.params.id;

    const Collection = new CollectionService(token, collectionId, null);

    const data = await Collection.collectionDetailInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail }); 
  };

  // GET
  // save external shared collection into my cluster
  static async shareCollection(req: Request, res: Response) {
    const token: string = req.body.token;
    const collectionId: string = req.params.id;

    const Collection = new CollectionService(token, collectionId, null);

    const data = await Collection.shareCollectionInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // POST
  // Create new collection
  static async createCollection(req: Request, res: Response) {
    const token: string = req.body.token;
    const collectionInfo: Collection<any> = req.body.collectionInfo;

    const Collection = new CollectionService(token, null, collectionInfo);

    const data = await Collection.createCollectionInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // PUT
  // Update my collection stats (name, shared)
  static async updateCollection(req: Request, res: Response) {
    const token: string = req.body.token;
    const id: string = req.params.id;
    const collectionInfo: Collection<any> = req.body.collectionInfo;    
    if (!collectionInfo.name && !collectionInfo.shared) return res.status(400).json({ error: true, detail: "bad request!" });
    
    const Collection = new CollectionService(token, id, collectionInfo);

    const data = await Collection.updateCollectionInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // DELETE
  // Delete my collection
  static async deleteCollection(req: Request, res: Response) {
    const token: string = req.body.token;
    const id: string = req.params.id;

    const Collection = new CollectionService(token, id, null);
    const data = await Collection.deleteCollectionInfo();

    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

};