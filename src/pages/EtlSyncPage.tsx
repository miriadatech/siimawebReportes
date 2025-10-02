import { Button, Card, DatePicker, Form, InputNumber, message, Typography } from "antd";
import api from "../services/api";


export default function EtlSyncPage() {
const [form] = Form.useForm();


const onRun = async () => {
try {
const values = await form.validateFields();
const since = values.since ? values.since.toISOString() : undefined;
const limit = values.limit || 500;
const { data } = await api.post("/etl/sync", { since, limit });
message.success(`Transferidos: ${data?.transferred ?? 0}`);
} catch (e: any) {
message.error(e?.message || "Error ejecutando ETL");
}
};


return (
<Card title="Sincronización MySQL → PostgreSQL" style={{ maxWidth: 640 }}>
<Typography.Paragraph>
Ejecuta una sincronización incremental usando <code>updated_at</code> como referencia.
</Typography.Paragraph>
<Form form={form} layout="vertical" initialValues={{ limit: 500 }}>
<Form.Item name="since" label="Cambios desde (opcional)">
<DatePicker showTime />
</Form.Item>
<Form.Item name="limit" label="Tamaño de lote" rules={[{ type: "number", min: 1, max: 5000 }] }>
<InputNumber style={{ width: "100%" }} />
</Form.Item>
<Button type="primary" onClick={onRun}>Ejecutar</Button>
</Form>
</Card>
);
}