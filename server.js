const http = require('http'); //On appelle l'objet HTTP de Node 
const app = require('./app'); //On appelle l'application

const normalizePort = (val) =>{
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }
    if(port>=0){
        return port;
    }
    return false;
};
// On indique sur quel PORT doit fonctionner l'application. (Ici port 3000 par défaut ou celui spécifié par l'environnement)
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = (error) =>{
    if (error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch(error.code){
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break;
        case 'EADDRINUSE': 
            console.error(bind + ' is already in use.')
            process.exit(1)
            break;
        default: 
            throw error
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('listening on ' + bind);
});

server.listen(port);
