const {
  parentPort, workerData
} = require('worker_threads');

const data = workerData;
const comenzo = Date.now();
let counter = 0;
for (let index = 0; index < data.length; index++) {
    const element = data[index];
    const nombre = element[11];

    if (nombre[0] == "m" || nombre[0] == "M") {
    counter++;
    }
}
const termino = Date.now();
parentPort.postMessage({ type: "data", value: counter });
parentPort.postMessage({
    type: "message",
    text:
    "comenzé en " +
    comenzo +
    " termine en " +
    termino +
    " duración: " +
    (termino - comenzo)
});