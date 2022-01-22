import mqtt from 'mqtt'

/*const host = '172.20.10.2'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})*/

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

let connectUrl = ``
let client = null

const setMqtt = (username, password, host, port) => {
    connectUrl = `mqtt://${host}:${port}`
    client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username,
        password,
        reconnectPeriod: 1000,
    })
    console.log('client set to '+connectUrl)
}

const sendMqtt = (topic, content) => {
    if (client) {
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
          if (error) {
            console.error(error)
          }
        })
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
          if (error) {
            console.error(error)
          }
        })
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
        client.publish(topic, content, { qos: 0, retain: false }, (error) => {
            if (error) {
              console.error(error)
            }
        })
            console.log(topic+' '+content)
    }
}

export {setMqtt, sendMqtt}