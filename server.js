// # SimpleServer
// A simple chat bot server

var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);


app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === '123456') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  console.log(222);
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
          console.log(text); // In tin nhắn người dùng
          if(text === 'Hi') {
            sendMessage(senderId, 'Xin chào bạn, mình có thể giúp gì cho bạn');
          } else if (text === 'mình muốn sản phẩm làm đẹp da') {
            sendMessage(senderId, 'Bên mình có sản phẩm dầu dừa làm đẹp da bạn vui lòng tham khảo link sau nhé');
          } else if (text === 'còn hàng không bạn') {
            sendMessage(senderId, 'Dạ bên em vẫn còn hàng ạ');
          } else if (text === 'bao nhiêu vậy bạn') {
            sendMessage(senderId, 'Dạ sản phẩm bên em là chai dầu dừa giá khoảng 50k nha anh/chị');
          } else {
            sendMessage(senderId, text + ' -> là sao ạ mình là bot mình không hiểu');
          }
        }
      }
    }
  }

  res.status(200).send('OK');
});

// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAAEew8knnZCwBAPHChi9WQhPvZCAaSTviefPMQDNEzHiyUafbH70muGgle8YyiRgOxnNXdxSZAZBTxrMQoBXLTsxVLDiYqH7hYea5ZBZATXctsfjSOup7VNizZAEJrk7nCXg3MdV5RMehGoAqMc78ALpQ0xQ8ipyIib9AAfrkEDAG2iCnb1eu65",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}
var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);
// app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
// app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

server.listen(port, function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
