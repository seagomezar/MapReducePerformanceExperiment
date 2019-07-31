const fetch = require('node-fetch');
const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

var datos = null;
function cargarDatos() {
    return fetch("https://data.cityofnewyork.us/api/views/25th-nujf/rows.json")
        .then(response => response.json())
        .then(responseJSON => {
        datos = responseJSON.data
            .concat(responseJSON.data)
            .concat(responseJSON.data)
            .concat(responseJSON.data)
            .concat(responseJSON.data)
            .concat(responseJSON.data)
            .concat(responseJSON.data)
            .concat(responseJSON.data)
            .concat(responseJSON.data);
        datosParte1 = datos.slice(0, Math.round(datos.length / 2));
        datosParte2 = datos.slice(
            Math.round(datos.length / 2),
            datos.length
        );
        console.log("Datos Cargados");
        });
}

function sinMapReduce() {
    const comezo = Date.now();
    console.log("SinMapReduce", "empezó el trabajo", comezo);
    let counter = 0;
    for (let index = 0; index < datos.length; index++) {
        const element = datos[index];
        const nombre = element[11];
        if (nombre[0] == "m" || nombre[0] == "M") {
        counter++;
        }
    }
    console.log("SinMapReduce", "Resultado: ", { M: counter });
    const termino = Date.now();
    console.log("SinMapReduce", "terminó el trabajo", termino);
    console.log(
        "duración del trabajo fue ",
        termino - comezo + "milisegundos"
    );
}

function conMapReduce1() {
    return new Promise((resolve) => {
        const comezo = Date.now();
        console.log("conMapReduce1", "empezó el trabajo", comezo);
        const worker1 = new Worker('./node3.js', {
            workerData: datos
        });
        worker1.on('message', (data) => {
            if (data.type === "message") {
                console.log("conMapReduce1", data.text);
            } else {
                reducer("M", data.value);
            }
        });
        const consolidado = {};
        let nodeCounter = 0;
        function reducer(key, value) {
            if (consolidado[key]) {
            consolidado[key] = value + consolidado[key];
            } else {
            consolidado[key] = value;
            }
            nodeCounter++;
            if (nodeCounter == 1) {
                console.log("conMapReduce1", "Resultado con MapReduce: ", consolidado);
                const termino = Date.now();
                console.log("conMapReduce1", "terminó el trabajo", termino);
                console.log(
                    "conMapReduce1", "duración del trabajo fue ",
                    termino - comezo + "milisegundos"
                );
                resolve();
            }
        }
    });
}


function conMapReduce2() {
    return new Promise((resolve) => {
        const comezo = Date.now();
        console.log("conMapReduce2", "empezó el trabajo", comezo);
        const worker1 = new Worker('./node3.js', {
            workerData: datosParte1
        });
        const worker2 = new Worker('./node3.js', {
            workerData: datosParte2
        });
        worker1.on('message', (data) => {
            if (data.type === "message") {
                console.log("conMapReduce2", data.text);
            } else {
                reducer("M", data.value);
            }
        });
        worker2.on('message', (data) => {
            if (data.type === "message") {
                console.log("conMapReduce2", data.text);
            } else {
                reducer("M", data.value);
            }
        });
        const consolidado = {};
        let nodeCounter = 0;
        function reducer(key, value) {
            if (consolidado[key]) {
                consolidado[key] = value + consolidado[key];
            } else {
            consolidado[key] = value;
            }
            nodeCounter++;
            if (nodeCounter == 2) {
            console.log("conMapReduce2", "Resultado con MapReduce: ", consolidado);
            const termino = Date.now();
            console.log("conMapReduce2", "terminó el trabajo", termino);
            console.log(
                "conMapReduce2", "duración del trabajo fue ",
                termino - comezo + "milisegundos"
            );
            resolve();
            }
        }
    });
}
    
(async () => {
    await cargarDatos();
    await sinMapReduce();
    await conMapReduce1()
    await conMapReduce2();
})();
