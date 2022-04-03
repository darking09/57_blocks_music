// Dependecies
import cluster from 'cluster';
import app from "./app";
import './database';

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  if (cluster.isMaster) {

    // Count the machine's CPUs
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const os = require('os');
    const cpuCount = os.cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i += 1) {
      cluster.fork();
    }
  } else {
    app.listen(app.get('port'));
    console.log(`Server on port`, app.get('port'));
  }
} else {
  app.listen(app.get('port'));
  console.log(`Server on port`, app.get('port'));
}
