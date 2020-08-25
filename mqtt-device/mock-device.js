/**
 * mock mqtt device
 */
var mqtt = require("mqtt");

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

const deviceName = "MQ_DEVICE";
let message = "test-message";
var ADDRESS  = "tcp://192.168.1.103:1883";
var CLIENTID = "Mock-Device";
var USERNAME = "admin";
var PWD      = "public";
var DATA_TOPIC = "DataTopic";
var CMD_TOPIC  = "CommandTopic";
var RESPONSE_TOPIC = "ResponseTopic";

// build mqtt client
var client  = mqtt.connect(ADDRESS,{
  clientId: CLIENTID,
  username: USERNAME,
  password: PWD,
  clean: false,
  protocolId: 'MQIsdp',
  protocolVersion: 3
});

// connect mqtt broker
client.on("connect",function(){
  console.log("connect successed.");
  // subscribe CommandTopic top
  client.subscribe(CMD_TOPIC, function (err) {
    if (!err) {
      console.log("subscribe " + CMD_TOPIC+ " successed.");
    }
  })
});

// 处理错误消息
client.on('error',function(err){
  console.log(err);
});

// 1. Publish random number every 15 seconds
setInterval(function () {
  let body = {
    name: deviceName,
    cmd: "randnum",
    randnum: getRandomFloat(25, 29).toFixed(1),
  };
  client.publish(DATA_TOPIC, JSON.stringify(body));
}, 15000);

// 2. Receive the reading request, then return the response
// 3. Receive the put request, then change the device value
client.on("message", (topic, val) => {
  console.log(val.toString());
  var data = JSON.parse(val.toString());
  if (data.method == "set") {
    message = data[data.cmd];
  } else {
    switch (data.cmd) {
      case "ping":
        data.ping = "pong";
        break;
      case "message":
        data.message = message;
        break;
      case "randnum":
        data.randnum = 12.123;
        break;
    }
  }
  client.publish(RESPONSE_TOPIC, JSON.stringify(data));
});
