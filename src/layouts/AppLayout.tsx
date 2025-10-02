import { Menu, Modal, message } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileTextOutlined,
  BarChartOutlined,
  CloudSyncOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 80;

export default function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const items: MenuProps["items"] = useMemo(
    () => [
      { key: "/app/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
      {
        key: "reportes",
        icon: <FileTextOutlined />,
        label: "Reportes",
        children: [
          { key: "/app/reportes/202", icon: <BarChartOutlined />, label: "Reporte 202" },
          { key: "/app/reportes/etl", icon: <CloudSyncOutlined />, label: "Sincronización" },
        ],
      },
      { type: "divider" as const },
      { key: "/app/logout", icon: <LogoutOutlined />, label: "Cerrar sesión" },
    ],
    []
  );

  const selectedKeys = useMemo(() => {
    if (pathname.startsWith("/app/reportes/etl")) return ["/app/reportes/etl"];
    if (pathname.startsWith("/app/dashboard")) return ["/app/dashboard"];
    if (pathname.startsWith("/app/reportes/202")) return ["/app/reportes/202"];
    return ["/app"];
  }, [pathname]);

  const siderWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const handleLogout = () => {
    Modal.confirm({
      title: "Cerrar sesión",
      content: "¿Seguro que deseas cerrar la sesión?",
      okText: "Sí, salir",
      cancelText: "Cancelar",
      okButtonProps: { danger: true },
      onOk: () => {

        localStorage.removeItem("auth_token");


        message.success("Sesión cerrada");

        const base =
          (import.meta as any)?.env?.BASE_URL && (import.meta as any).env.BASE_URL !== "/"
            ? (import.meta as any).env.BASE_URL
            : "/";
        const loginUrl = base.replace(/\/+$/, "") + "/reportesApp/login";


        window.location.assign(loginUrl);
      },
    });
  };

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "__logout") return handleLogout();
    navigate(String(key));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", width: "100vw" }}>
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: siderWidth,
          background: "#1677ff",
          overflow: "hidden",
          zIndex: 1000,
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 48,
            margin: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {!collapsed && <span style={{ fontWeight: "bold" }}>Reportes</span>}
          <span onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>

        <Menu
          theme="light"
          mode="inline"
          inlineCollapsed={collapsed}
          items={items}
          selectedKeys={selectedKeys}
          onClick={onMenuClick}   
          style={{ borderRight: 0, flex: 1 }}
        />
      </aside>

      <main
        style={{
          minHeight: "100vh",
          marginLeft: siderWidth,
          width: `calc(100vw - ${siderWidth}px)`,
          transition: "margin-left 0.2s, width 0.2s",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div style={{ padding: 16, flex: 1, minWidth: 0, overflow: "auto" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
