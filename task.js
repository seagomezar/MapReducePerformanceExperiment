self.addEventListener(
  "message",
  function(e) {
    var data = e.data;
    switch (data.cmd) {
      case "start":
        self.postMessage("WORKER STARTED: " + data.msg);
        fetch("https://google.com").then(() => {
          self.postMessage("I made an HTTP Request");
        });
        for (let i = 0; i <= 10000; i++) {
          self.postMessage("Counter" + i);
        }
        self.postMessage("Terminé from nodo 1");
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
