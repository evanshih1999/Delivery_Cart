import express from 'express'
import cors from 'cors'
import http from 'http'
import connectMongoDB from './mongo.js'
import router from './routes/api.js'
import bodyParser from 'body-parser';
import wssConnect from './wssConnect.js'
import mqtt from 'mqtt'
import WebSocket from 'ws'

const app = express()
const server = http.createServer(app)
const {wss, sendFile, sendData} = wssConnect(server)

/*const client = new WebSocket('ws://172.20.10.3:8080')
client.onmessage = (byteString) => {
  const { data } = byteString
  const buff = Buffer.from(data, 'base64')
  sendFile(buff)
}*/

const connectUrl = `mqtt://`+process.env.YOUR_MQTT_BROKER_AND_NGINX_SERVER_IP

const qclientId = `mqtt_${Math.random().toString(16).slice(3)}`
const qclient = mqtt.connect(connectUrl, {
  qclientId,
  clean: true,
  connectTimeout: 4000,
  username: 'QRcode',
  password: 'QRcode',
  reconnectPeriod: 1000,
})

qclient.on('connect', () => {
  console.log('Connected')
  qclient.subscribe(['QRcode'], () => {
    console.log(`Subscribe to topic QRcode`)
  })
})

qclient.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  sendData([topic, payload.toString()])
})

const fclientId = `mqtt_${Math.random().toString(16).slice(3)}`
const fclient = mqtt.connect(connectUrl, {
  fclientId,
  clean: true,
  connectTimeout: 4000,
  username: 'Face',
  password: 'Face',
  reconnectPeriod: 1000,
})

fclient.on('connect', () => {
  console.log('Connected')
  fclient.subscribe(['Face'], () => {
    console.log(`Subscribe to topic Face`)
  })
})

fclient.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  sendData([topic, payload.toString()])
})

// connect database
const db = connectMongoDB()

db.once('open', () => {
  wss.on('connection', (ws) => {
    console.log('websocket client connected!')
    ws.onmessage = async (byteString) => {
      const { data } = byteString
      const task = JSON.parse(data)
      if (task.info=='getImage') {
        sendFile()
      }
    }
  })
  const PORT = process.env.port || 4000

  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
  })
})


// init middleware
app.use(cors())
app.use(bodyParser.json())

// define routes
app.use('/api', router)

// define server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})