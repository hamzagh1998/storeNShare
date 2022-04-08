import { Router } from "express";

import { ClusterController } from "./cluster.controller";

import { errorHandler } from "../../utils";

const ClusterRouter = Router();

ClusterRouter.get("/my", errorHandler(ClusterController.myCluster));
ClusterRouter.get("/all", errorHandler(ClusterController.allClusters));
ClusterRouter.get("/:id", errorHandler(ClusterController.clusterDetail));
ClusterRouter.post("/create", errorHandler(ClusterController.createCluster));
ClusterRouter.put("/update", errorHandler(ClusterController.updateCluster));
ClusterRouter.delete("/delete", errorHandler(ClusterController.deleteCluster));

export { ClusterRouter };