import { useState, useEffect } from 'react'
import { message } from 'antd'
import styled from 'styled-components'
import Menu from './Menu'
import SignIn from './SignIn'
import Register from './Register'
import Car from './Car'
import Door from './Door'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    margin: auto;
    background: #F5E1FD;
`;

const LOCALSTORAGE_KEY1 = "save-me"
const LOCALSTORAGE_KEY2 = "save-pwd"

function App() {
    const savedMe = localStorage.getItem(LOCALSTORAGE_KEY1)
    const savedPwd = localStorage.getItem(LOCALSTORAGE_KEY2)
    const [signedIn, setSignedIn] = useState(false)
    const [registered, setRegistered] = useState(true)
    const [me, setMe] = useState(savedMe||'')
    const [pwd, setPwd] = useState(savedPwd||'')
    const [remember, setRemember] = useState(false)
    
    const displayStatus = (payload, duration) => {
        if (payload.msg) {
            const { type, msg } = payload
            const content = {
                content: msg, duration: duration }
            switch (type) {
                case 'success':
                    message.success(content)
                    break
                case 'info':
                    message.info(content)
                    break
                case 'error':
                default:
                    message.error(content)
                    break
    }}}

    useEffect(() => {
        if (remember) {
            localStorage.setItem(LOCALSTORAGE_KEY1, me)
            localStorage.setItem(LOCALSTORAGE_KEY2, pwd)
        } else {
            localStorage.setItem(LOCALSTORAGE_KEY1, '')
            localStorage.setItem(LOCALSTORAGE_KEY2, '')
        }
      }, [remember, me, pwd])

    return (
        <Wrapper>
            {signedIn?
                <Menu
                    me = {me}
                    setSignedIn = {setSignedIn}
                    displayStatus = {displayStatus}
                />:
                registered?
                    <SignIn
                        me = {me}
                        setMe = {setMe}
                        pwd = {pwd}
                        setPwd = {setPwd}
                        setRemember = {setRemember}
                        setSignedIn = {setSignedIn}
                        setRegistered = {setRegistered}
                        displayStatus = {displayStatus}
                    />:
                    <Register
                        setMe = {setMe}
                        setPwd = {setPwd}
                        setRemember = {setRemember}
                        setSignedIn = {setSignedIn}
                        setRegistered = {setRegistered}
                        displayStatus = {displayStatus}
                    />
            }
        </Wrapper>
    )
}
  
export default App;