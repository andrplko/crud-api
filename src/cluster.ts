import { config } from 'dotenv';
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

config();
const numCPUs = availableParallelism();
const PORT = process.env.PORT || 3000;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork({ WORKER_PORT: +PORT + i });
  }

  for (const id in cluster.workers) {
    const worker = cluster.workers[id]!;

    worker.on('message', (msg) => {
      console.log(`New message - worker ${worker.process.pid}:`, msg);
    });
  }

  cluster.on('exit', () => {
    cluster.fork();
  });
} else {
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Successful created' }));
  });

  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  console.log(`Worker ${process.pid} started`);
}
