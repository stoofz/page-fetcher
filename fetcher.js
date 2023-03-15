const request = require('request');
const fs = require('fs');
const readline = require("readline");

let args = process.argv.splice(2);

const writeFile = function(body) {
  fs.writeFile(args[1], body, function() {
    return console.log(`Downloaded and saved ${body.length} bytes to ${args[1]}`);
  });
};

const downloadPage = request(args[0], function(err, response, body) {

  if (err) {
    return console.log("Failed... Invalid URL");
  }
  
  if (response.statusCode !== 200) {
    return console.log(`Failed... Status Code ${response.statusCode}`);
  }

  fs.open(args[1], 'wx', function(err) {
    if (err) {
      if (err.code === 'ENOENT') {
        return console.log("Failed... Invalid File Path");
      }

      if (err.code === 'EEXIST') {
        const rl = readline.createInterface(process.stdin, process.stdout);
        rl.question(`${args[1]} already exists. Override? (Y)es or (N)o: `, function(option) {
          if (option === 'y') {
            writeFile(body);
          } else if (option === 'n') {
            console.log("File save aborted");
          }
          rl.close();
          return;
        });
      }
    } else {
      writeFile(body);
      return;
    }
  });
});

downloadPage;

