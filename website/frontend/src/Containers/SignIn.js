import { Form, Input, Button, Checkbox } from 'antd'
import Title from "../Components/Title"
import axios from '../api'

const SignIn = ({me, setMe, pwd, setPwd, setRemember, setSignedIn, setRegistered, displayStatus}) => {
    const onFinish = async (values) => {
        console.log('Success:', values)
        const username = values.username
        const password = values.password
        const remember = values.remember
        try {
            const {
                data: { msg },
            } = await axios.post('/api/user/login', {
                username,
                password
            });
            setMe(username)
            setPwd(password)
            setRemember(remember)
            setSignedIn(true)
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
                <h1 style={{margin:20}}>MyCar</h1>
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
                    username: me,
                    password: pwd,
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
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
                        Sign In
                    </Button>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                    offset: 8,
                    span: 16,
                    }}
                >
                    <p>
                        No account yet?
                        <Button type="link" onClick={()=>setRegistered(false)}>
                            Register
                        </Button>
                    </p>
                </Form.Item>

            </Form>
        </>
    )
}

export default SignIn