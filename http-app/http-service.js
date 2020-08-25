'use strict';

const Hapi = require('hapi');

// 创建一个服务监听7788端口
const server = Hapi.server({
    host: 'localhost',
    port: 7788
});

// 添加路由
server.route({
    method: ['GET', 'POST'],
    path: '/hello',
    handler: function (request, h) {
        console.log('request data from /hello', request.payload)

        return 'hello world';
    }
});

// 启动服务
const start = async function () {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();