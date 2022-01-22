import { useEffect, useState } from "react"
import Title from "../Components/Title"
import { Button, Row, Col, Card } from 'antd'
import CarModal from "./CarModal"
import DoorModal from "./DoorModal"
import axios from "../api"
import Car from '../Containers/Car'
import Door from '../Containers/Door'
import { DeleteOutlined } from '@ant-design/icons'
import './icon.css'

const Menu = ({me, setSignedIn, displayStatus}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [doorVisible, setDoorVisible] = useState(false)
    const [car, setCar] = useState('')
    const [door, setDoor] = useState('')
    const [cars, setCars] = useState([])
    const [doors, setDoors] = useState([])
    const [host, setHost] = useState('')
    const [port, setPort] = useState('')

    useEffect(async ()=>{
        const {
            data: cars
        } = await axios.post('/api/car/find', {
            username: me,
        })
        setCars(cars)
    }, [modalVisible])

    useEffect(async ()=>{
        const {
            data: doors
        } = await axios.post('/api/door/find', {
            username: me,
        })
        setDoors(doors)
    }, [doorVisible])

    const addCar = () => {
        setModalVisible(true)
    }

    const addDoor = () => {
        setDoorVisible(true)
    }
    
    return (
        <>
            {car?
                <Car
                    car = {car}
                    setCar = {setCar}
                    displayStatus = {displayStatus}
                    host = {host}
                />:
                    door?
                    <Door
                        door = {door}
                        setDoor = {setDoor}
                        displayStatus = {displayStatus}
                        host = {host}
                    />:
                        <>
                        <Title>
                            <h1>MyCar</h1>
                        </Title>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Card title={<span style={{fontSize: 30}}>My Cars</span>} bordered={false} style={{width: 400, height: 350, margin: 20, borderRadius: 20}}>
                                    <div style={{display:'block'}}>
                                        {cars.map(car=>
                                            <>
                                                <Button type='link' style={{fontSize: 20}} onClick={async () => {
                                                    setCar(car.carname)
                                                    setHost(car.host)
                                                    setPort(car.port)
                                                    const {
                                                        data: {msg}
                                                    } = await axios.post('/api/car/set', {
                                                        username: car.carname,
                                                        password: car.password,
                                                        host: car.host,
                                                        port: car.port
                                                    })
                                                }}>
                                                    {car.carname}
                                                </Button>
                                                <DeleteOutlined className='icon' onClick={async ()=>{
                                                    const {
                                                        data: {msg}
                                                    } = await axios.post('/api/car/delete', {
                                                        username: me,
                                                        carname: car.carname
                                                    })
                                                    const {
                                                        data: cars
                                                    } = await axios.post('/api/car/find', {
                                                        username: me,
                                                    })
                                                    setCars(cars)
                                                }}/>
                                                <br></br>
                                            </>)
                                        }
                                        {/*<Button type='link' style={{fontSize: 20}} onClick={()=>setCar('Car1')}>Car1</Button>*/}
                                        <Button type='link' style={{fontSize: 20, color:'gray'}} onClick={addCar}>Add car</Button>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title={<span style={{fontSize: 30}}>My Doors</span>} bordered={false} style={{width: 400, height: 350, margin: 20, borderRadius: 20}}>
                                    <div style={{display:'block'}}>
                                        {doors.map(door=>
                                            <>
                                                <Button type='link' style={{fontSize: 20}} onClick={async () => {
                                                    setDoor(door.doorname)
                                                    setHost(door.host)
                                                    setPort(door.port)
                                                    const {
                                                        data: {msg}
                                                    } = await axios.post('/api/door/set', {
                                                        username: door.doorname,
                                                        password: door.password,
                                                        host: door.host,
                                                        port: door.port
                                                    })
                                                }}>
                                                    {door.doorname}
                                                </Button>
                                                <DeleteOutlined className='icon' onClick={async ()=>{
                                                    const {
                                                        data: {msg}
                                                    } = await axios.post('/api/door/delete', {
                                                        username: me,
                                                        doorname: door.doorname
                                                    })
                                                    const {
                                                        data: doors
                                                    } = await axios.post('/api/door/find', {
                                                        username: me,
                                                    })
                                                    setDoors(doors)
                                                }}/>
                                                <br></br>
                                            </>)
                                        }
                                        {/*<Button type='link' style={{fontSize: 20}} onClick={()=>setDoor('Door1')}>Door1</Button>*/}
                                        <Button type='link' style={{fontSize: 20, color:'gray'}} onClick={addDoor}>Add door</Button>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <div>
                            <p>
                                Welcome, {me}.&emsp;
                                <Button type="primary" onClick={()=>setSignedIn(false)}>
                                    Sign Out
                                </Button>
                            </p>
                        </div>
                        <CarModal
                                visible = {modalVisible}
                                onCreate = {async ({carname, password, host, port}) => {
                                    const {
                                        data: { msg },
                                    } = await axios.post('/api/car/add', {
                                        username: me,
                                        carname,
                                        password,
                                        host,
                                        port
                                    })
                                    setModalVisible(false);
                                }}
                                onCancel = {()=>{
                                    setModalVisible(false);
                                }}
                        />
                        <DoorModal
                                visible = {doorVisible}
                                onCreate = {async ({doorname, password, host, port}) => {
                                    const {
                                        data: { msg },
                                    } = await axios.post('/api/door/add', {
                                        username: me,
                                        doorname,
                                        password,
                                        host,
                                        port
                                    })
                                    setDoorVisible(false);
                                }}
                                onCancel = {()=>{
                                    setDoorVisible(false);
                                }}
                        />
                    </>
            }
        </>
    )
}

export default Menu