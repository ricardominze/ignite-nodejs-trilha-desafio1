class Logger {

  constructor() {

    this.fs = require('fs');
  }

  getTags() {

    let dt = new Date();
    let d = dt.getDate().toString().padStart(2, '0');
    let m = (dt.getMonth()+1).toString().padStart(2, '0');
    let y = dt.getFullYear();
    let h = dt.getHours().toString().padStart(2, '0');
    let i = dt.getMinutes().toString().padStart(2, '0');
    let s = dt.getSeconds().toString().padStart(2, '0');
    let tags = '['+y+'-'+m+'-'+d+' '+h+':'+i+':'+s+'] ';
    return tags;
  }

  write(filename, content) {

    content = this.getTags() + content;
    this.fs.appendFile(filename, content+"\n", function (err) {
      if (err) throw err;
    })
  }
}

module.exports = new Logger();