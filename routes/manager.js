var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
  userName: 'monni@v6uvsv2f7a.database.windows.net',
  server: 'v6uvsv2f7a.database.windows.net',
  password: 'Laundering1',
  database: 'monni_db',
  options: {
    database: 'monni_db',
    encrypt: true
  },
  debug: {
    packet: true,
    data: true,
    payload: true,
    token: true,
    log: true
  }
};

var conn;
var machines = [];


var getMachineData = function(req, res) {

  machines = [];
  conn = new Connection(config);

  conn.on('connect', function(err) {
    console.log('connected');
    getMachines(req, res);
  });

  conn.on('debug', function(text) {
    console.log('debug: ' + text);
  });

  conn.on('infoMessage', function(info) {
    console.log('info: ' + info);
  });

  conn.on('errorMessage', function(err) {
    console.log('error msg:');
    console.dir(err);
  });

  conn.on('close', function() {
    console.log('CLOSING TIME');
  });

  conn.on('end', function(end) {
    console.log('end: ' + end);
  });
}

var getMachineDetails = function(id, name, locId, locName, managerId, revenue, loads) {
  return {
    id: id,
    name: name,
    locId: locId,
    locName: locName,
    managerId: managerId,
    revenue: revenue,
    loads: loads
  };
};

var getMachines = function(req, res) {
  var request = new Request("select * from MachineDetails", function(err, rowCount) {
    if (err) {
      console.log(err);
    }
    else {
      renderPage(req, res);
    }
  });

  request.on('row', function(columns) {
    for (var i = 0; i < columns.length; i = i + 7) {
      machines.push(getMachineDetails(
        columns[i].value,
        columns[i + 1].value,
        columns[i + 2].value,
        columns[i + 3].value,
        columns[i + 4].value,
        columns[i + 5].value,
        columns[i + 6].value
      ));
    }
  });

  conn.execSql(request);
};

var renderPage = function(req, res) {
  console.dir(machines);
  res.render('manager', {
    machines: machines
  });
}

exports.index = function(req, res) {
  getMachineData(req, res);
}