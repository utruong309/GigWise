import { exec } from 'child_process';
import path from 'path';

export const runClustering = () => {
  return new Promise((resolve, reject) => {
    const csvPath = path.join('uploads', 'latest.csv');
    exec(`python3 clustering.py ${csvPath}`, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
};