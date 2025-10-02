import { Card, Col, Row, Statistic } from "antd";


export default function Dashboard() {
return (
<Row gutter={[16, 16]}>
<Col xs={24} sm={12} md={6}><Card><Statistic title="Pacientes" value={1280} /></Card></Col>
<Col xs={24} sm={12} md={6}><Card><Statistic title="Atenciones hoy" value={47} /></Card></Col>
<Col xs={24} sm={12} md={6}><Card><Statistic title="Pendientes" value={12} /></Card></Col>
<Col xs={24} sm={12} md={6}><Card><Statistic title="Errores ETL" value={0} /></Card></Col>
</Row>
);
}