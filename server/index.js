import express from 'express'
import http from 'http'
import url from 'url'
import WebSocket from 'ws'
import { SocketHandler } from './poker'
 
const app = express()
 
app.use(express.static('client'))
app.use('/build', express.static('build'))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws, req) {
    const location = url.parse(req.url, true)
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    const handler = new SocketHandler(ws)
    ws.on('message', function incoming(message) {
        console.log('message recieved', )
        handler.onmessage(JSON.parse(message))
    })
  
    ws.send('something')
    handler.sendmessage('message from handler')
})
 
server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port)
})