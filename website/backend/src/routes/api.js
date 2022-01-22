import express from 'express'
import nodemailer from 'nodemailer'
import dotenv from "dotenv-defaults"
import bcrypt from "bcrypt"
import User from '../models/User.js'
import Vcode from '../models/Vcode.js'
import {setMqtt, sendMqtt} from '../mqtt.js'
import Car from '../models/Car.js'
import Door from '../models/Door.js'

dotenv.config();

// generate vcode
function makevcode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const router = express.Router()

router.post('/user/set_verify_code', async (req, res) => {
    const email = req.body.mail
    const vcode = makevcode(6)
    
    if (await Vcode.findOne({ email: email })) {
        try {
            await Vcode.updateOne({ email: email }, { $set: { vcode: vcode }})
        } catch(e) { throw new Error("Verification code update error")}
    } else {
        try {
            const newVcode = new Vcode({ email, vcode })
            await newVcode.save()
        } catch (e) { throw new Error("Verification code creation error")}
    }

    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
    })
      
    var mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'MyCar Website verification code',
        text: 'Your verification code is: ' + vcode
    }
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })

    res.json({msg: 'Verificaiton code sent to ' + email})
})

router.post('/user/register', async (req, res) => {
    const email = req.body.mail
    const vcode = req.body.vcode
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password,10)
    if (!vcode) {
        res.status(400).send({ msg: "Didn't click verify button!" })
        return
    }
    if (!(await Vcode.findOne({ email: email, vcode: vcode }))) {
        res.status(400).send({ msg: 'Wrong verify code!'})
        return
    }
    if (await User.findOne({ username: username })) {
        res.status(400).send({ msg: 'username exist!' })
        return
    }
    if (await User.findOne({ email: email })) {
        res.status(400).send({ msg: 'email exist!' })
        return
    }
    try {
        const newUser = new User({ username, email, password })
        await newUser.save()
        res.json({msg: 'User created'})
        await Vcode.deleteOne({email: email, vcode: vcode})
    } catch (e) { throw new Error("User creation error")}
})

router.post('/user/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = await User.findOne({ username: username })
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            res.json({ msg: 'Success!' })
            return
        }
        res.status(400).send({ msg: 'Incorrect password' })
        return
    }
    res.status(400).send({ msg: "Username doesn't exist" })
})

router.post('/car/add', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const carname = req.body.carname
    const host = req.body.host
    const port = req.body.port
    try {
        const newCar = new Car({ username, password, carname, host, port })
        await newCar.save()
        console.log(carname+' added!')
        res.json({ msg: carname+' added!' })
    } catch (e) { throw new Error("Car creation error")}
})

router.post('/door/add', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const doorname = req.body.doorname
    const host = req.body.host
    const port = req.body.port
    try {
        const newDoor = new Door({ username, password, doorname, host, port })
        await newDoor.save()
        console.log(doorname+' added!')
        res.json({ msg: doorname+' added!' })
    } catch (e) { throw new Error("Door creation error")}
})

router.post('/car/find', async (req, res) => {
    const username = req.body.username
    const cars = await Car.find({username: username})
    for (let i=0; i<cars.length; i++) {
        cars[i] = {
            username: cars[i].username,
            password: cars[i].password,
            carname: cars[i].carname,
            host: cars[i].host,
            port: cars[i].port
        }
    }
    res.json(cars)
})

router.post('/door/find', async (req, res) => {
    const username = req.body.username
    const doors = await Door.find({username: username})
    for (let i=0; i<doors.length; i++) {
        doors[i] = {
            username: doors[i].username,
            password: doors[i].password,
            doorname: doors[i].doorname,
            host: doors[i].host,
            port: doors[i].port
        }
    }
    res.json(doors)
})

router.post('/car/set', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const host = req.body.host
    const port = req.body.port
    setMqtt(username, password, host, port)
    res.json({ msg: 'success' })
})

router.post('/door/set', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const host = req.body.host
    const port = req.body.port
    setMqtt(username, password, host, port)
    res.json({ msg: 'success' })
})

router.post('/car/delete', async (req, res) => {
    const username = req.body.username
    const carname = req.body.carname
    await Car.deleteOne({username: username, carname: carname})
    res.json({ msg: 'success' })
})

router.post('/door/delete', async (req, res) => {
    const username = req.body.username
    const doorname = req.body.doorname
    await Door.deleteOne({username: username, doorname: doorname})
    res.json({ msg: 'success' })
})

router.post('/car/control', async (req, res) => {
    const car = req.body.car
    const command = req.body.command
    sendMqtt(car, command)
    //console.log(car+' '+command)
    res.json({ msg: command })
})

router.post('/door/control', async (req, res) => {
    const door = req.body.door
    const command = req.body.command
    sendMqtt(door, command)
    //console.log(door+' '+command)
    res.json({ msg: command })
})

export default router