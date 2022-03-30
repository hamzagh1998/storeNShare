import { Request, Response } from 'express';

import { ClusterService } from '../../services/cluster.service';

export class ClusterController {

  // GET
  // Get my cluster detail
  static async myCluster(req: Request, res: Response) {
    const token: string = req.body.token;

    const Cluster = new ClusterService(token, null, null);
    const data = await Cluster.myClusterInfo();
    
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // GET
  // GET all Clusters (only shared ones)
  static async allClusters(req: Request, res: Response) {
    const token: string = req.body.token;

    const Cluster = new ClusterService(token, null, null);
    const data = await Cluster.allClustersInfo();
    
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // GET
  // Get others clusters detail (if it is shared)
  static async clusterDetail(req: Request, res: Response) {
    const token: string = req.body.token;
    const clusterId: string = req.params.clusterId;

    if (!token) return res.status(403).json({ error: true, detail: 'unauthorized!' });
    if (!clusterId) return res.status(400).json({ error: true, detail: 'bad request!' });

    const Cluster = new ClusterService(token, clusterId, null);
    const data = await Cluster.clusterDetailInfo();
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });

  };

  // POST
  // Update the cluster stats
  static async createCluster(req: Request, res: Response) {
    const token: string = req.body.token;
    const clusterInfo: {name: string, shared: boolean} = req.body.clusterInfo;    

    const Cluster = new ClusterService(token, null, clusterInfo);
    const data = await Cluster.createClusterInfo();

    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };

  // PUT/PATCH
  // Update the cluster stats
  static async updateCluster(req: Request, res: Response) {
    const token: string = req.body.token;
    const clusterInfo: {name: string, shared: boolean} = req.body.clusterInfo;    
    if (!clusterInfo.name && !clusterInfo.shared) return res.status(400).json({ error: true, detail: 'bad request!' });

    const Cluster = new ClusterService(token, null, clusterInfo);
    const data = await Cluster.updateClusterInfo();
    
    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });

  };

  // DELETE
  // Delate cluster
  static async deleteCluster(req: Request, res: Response) {
    const token: string = req.body.token;

    const Cluster = new ClusterService(token, null, null);
    const data = await Cluster.deleteClusterInfo();

    return data.error
                    ? res.status(500).json({ error: true, detail: data.detail })
                    : res.status(200).json({ error: false, detail: data.detail });
  };
};