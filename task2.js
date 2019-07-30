self.addEventListener(
  "message",
  function(e) {
    var data = e.data;
    switch (data.cmd) {
      case "start":
        self.postMessage("WORKER STARTED 2: " + data.msg);
        for (let i = 10001; i <= 20000; i++) {
          self.postMessage("Counter" + i);
        }
        self.postMessage("Terminé from nodo 2");
        break;
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
