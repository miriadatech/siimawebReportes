import { Card, Form, Input, Button, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
const { login } = useAuth();
const [loading, setLoading] = useState(false);
const nav = useNavigate();


const onFinish = async (values: any) => {
setLoading(true);
try {
await login(values.email, values.password);
nav("/app", { replace: true });
} catch (e: any) {
// Mensajes del Backend
} finally {
setLoading(false);
}
};


return (
<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
<Card style={{ width: 380 }}>
<Typography.Title level={3} style={{ textAlign: "center" }}>Iniciar sesión</Typography.Title>
<Form layout="vertical" onFinish={onFinish}>
<Form.Item label="Correo" name="email" rules={[{ required: true, message: "Ingresa tu correo" }, { type: "email", message: "Correo inválido" }]}>
<Input prefix={<MailOutlined />} placeholder="tucorreo@dominio.com" />
</Form.Item>
<Form.Item label="Contraseña" name="password" rules={[{ required: true, message: "Ingresa tu contraseña" }]}>
<Input.Password prefix={<LockOutlined />} placeholder="••••••" />
</Form.Item>
<Button type="primary" htmlType="submit" block loading={loading}>Entrar</Button>
</Form>
</Card>
</div>
);
}