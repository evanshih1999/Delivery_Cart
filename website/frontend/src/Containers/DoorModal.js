import { useState } from 'react';
import { Modal, Input } from 'antd';

const DoorModal = ({ visible, onCreate, onCancel }) => {
    const [doorname, setDoorname] = useState("")
    const [host, setHost] = useState("")
    const [port, setPort] = useState("")
    const [password, setPassword] = useState("")

    return (
        <Modal
            visible = {visible}
            onOk = {()=>onCreate({doorname, password, host, port})}
            onCancel = {onCancel}
            okText = "Add"
            title = "Add a new door"
        >
            <Input
                value={doorname}
                onChange={(e) => setDoorname(e.target.value)}
                placeholder="Enter door name here..."
                style={{marginBottom:10}}
            />
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password here..."
                style={{marginBottom:10}}
            />
            <Input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="Enter host name here..."
                style={{marginBottom:10}}
            />
            <Input
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="Enter port number here..."
                style={{marginBottom:10}}
            />
        </Modal>
    );
};

export default DoorModal;