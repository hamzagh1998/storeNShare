import { sign } from "crypto";
import { logger } from "../logger";

export function spawnWorker<
  X extends  { on(a: string, b: Function): void }, 
  Y extends {fork(): X }>
  (workers: Array<X>, cluster: Y, i: number) {
  workers[i] = cluster.fork();
  logger.info('New worker spawns: ' + i);

  // Optional: Restart worker on exit
  workers[i].on('exit', (code: number, signal: any) => {
    
    logger.error('Worker was killed by signal: ' + signal)
    logger.error('Worker exited with error code: ' + code)
    logger.info('Respawning worker:', i);
    spawnWorker(workers, cluster, i);
  });
};