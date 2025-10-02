export default function Logo({ collapsed = false }: { collapsed?: boolean }) {
return (
<div style={{ color: "#fff", fontWeight: 800 }}>
{collapsed ? "RM" : "Reportes"}
</div>
);
}