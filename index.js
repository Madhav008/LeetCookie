// const os = require('os');

// const numCores = os.cpus().length;

// console.log(`Number of CPU cores: ${numCores}`);


// function sumArray(arr) {
//     let sum = 0;
//     for (let i = 0; i < arr.length; i++) {
//       sum += arr[i];
//     }
//     return sum;
//   }
  
//   const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//   console.time('Single Process');
//   console.log(sumArray(arr));
//   console.timeEnd('Single Process');
  
  const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

  function sumArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum;
  }
  
  if (isMainThread) {
    const arr = new Array(1e7).fill(1);
    const threads = new Set();
    const threadCount = require('os').cpus().length;
    const results = []; // Add this line to initialize results

    console.time('Multithreading');
    for (let i = 0; i < threadCount; i++) {
      const worker = new Worker(__filename, { workerData: arr });
      threads.add(worker);
    }
  
    for (let worker of threads) {
      worker.on('error', (err) => { throw err; });
      worker.on('exit', () => {
        threads.delete(worker);
        if (threads.size === 0) {
          console.log(sumArray(results));
          console.timeEnd('Multithreading');
        }
      });
      worker.on('message', (msg) => {
        results.push(msg);
      });
    }
  } else {
    const arr = workerData;
    const result = sumArray(arr.slice(arr.length / 2));
    parentPort.postMessage(result);
  }
  