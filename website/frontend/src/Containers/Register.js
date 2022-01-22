import { Form, Input, Button, Checkbox } from 'antd'
import Title from "../Components/Title"
import axios from '../api'

const Register = ({setMe, setPwd, setRemember, setSignedIn, setRegistered, displayStatus}) => {
    const onFinish = async (values) => {
        console.log('Success:', values)
        const mail = values.email
        const vcode = values.vcode
        const username = values.username
        const password = values.password
        const remember = values.remember
        try {
            const {
                data: { msg },
            } = await axios.post('/api/user/register', {
                mail,
                vcode,
                username,
                password
            });
            setMe(username)
            setPwd(password)
            setRemember(remember)
            setSignedIn(true)
            setRegistered(true)
            displayStatus({
                type: 'success',
                msg: msg
            }, 0.5)
        } catch (error) {
            const { data: { msg } } = error.response
            displayStatus({
                type: 'error',
                msg: msg
            }, 0.5)
        }
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    };
    
    return (
        <>
            <Title>
                <h1>MyCar</h1>
            </Title>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your email!',
                    },
                    ]}
                >
                    <Input.Search
                        enterButton="Verify"
                        onSearch={ async (mail) => {
                            if (!mail) {
                                displayStatus({
                                    type: 'error',
                                    msg: 'Please enter an email.'
                                }, 0.5)
                                return
                            }
                            const {
                                data: { msg },
                            } = await axios.post('/api/user/set_verify_code', {
                                mail
                            });
                            displayStatus({
                                type: 'success',
                                msg: msg
                            }, 0.5)
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Verification"
                    name="vcode"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Verification code!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                    offset: 8,
                    span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    offset: 8,
                    span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                    Register
                    </Button>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    offset: 8,
                    span: 16,
                    }}
                >
                    <p>
                        Have an account?
                        <Button type="link" onClick={()=>setRegistered(true)}>
                            Sign In
                        </Button>
                    </p>
                </Form.Item>
            </Form>
        </>
    )
}

export default Register