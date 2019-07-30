self.addEventListener(
  "message",
  function(e) {
    var data = e.data;
    switch (data.cmd) {
      case "procesar":
        const comenzo = Date.now();
        let counter = 0;
        for (let index = 0; index < data.msg.length; index++) {
          const element = data.msg[index];
          const nombre = element[11];

          if (nombre[0] == "m" || nombre[0] == "M") {
            counter++;
          }
        }
        const termino = Date.now();
        self.postMessage({ type: "data", value: counter });
        self.postMessage({
          type: "message",
          text:
            "comenzé en " +
            comenzo +
            " termine en " +
            termino +
            " duración: " +
            (termino - comenzo)
        });
      case "stop":
        self.postMessage(
          "WORKER STOPPED: " + data.msg + ". (buttons will no longer work)"
        );
        self.close(); // Terminates the worker.
        break;
      default:
        self.postMessage("Unknown command: " + data.msg);
    }
  },
  false
);
