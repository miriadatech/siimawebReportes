import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Table,
  Space,
  message,
  Typography,
  Tooltip,
  Empty,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios, { AxiosError } from "axios";

const { Title, Text } = Typography;

/* =========================
   Tipos
   ========================= */
interface ReportRow {
  [key: string]: any; 
}

interface Entidad {
  id: number;
  nombre: string;
  codigo?: string;
}

interface FetchParams {
  entidadId?: number;
  cicloVida?: string;
  page: number;
  pageSize: number;
}

interface ApiListResponse {
  data: ReportRow[];
  total: number;
}

interface Reporte202Props {
  apiBaseUrl: string;
  token?: string | null;
}

/* =========================
   Utilidades
   ========================= */
function downloadCSV(rows: ReportRow[], filename = "reporte_202.csv") {
  if (!rows || rows.length === 0) {
    message.warning("No hay datos para exportar.");
    return;
  }
  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(","), // encabezados
    ...rows.map((r) =>
      headers
        .map((h) => {
          const v = r[h];
          // Escapar comas, dobles comillas y saltos de línea
          if (v === null || v === undefined) return "";
          const s = String(v).replace(/"/g, '""');
          if (/[",\n]/.test(s)) return `"${s}"`;
          return s;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface CicloDeVida {
  id: number;
  nombre: string;
  edadMinAnios: number | null;
  edadMaxAnios: number | null;
}

/* =========================
   Componente principal
   ========================= */
const Reporte202: React.FC<Reporte202Props> = ({ apiBaseUrl, token }) => {
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [ciclos, setCiclos] = useState<CicloDeVida[]>([]);
  const [entidadId, setEntidadId] = useState<number | undefined>(undefined);
  const [cicloVida, setCicloVida] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [columns, setColumns] = useState<ColumnsType<ReportRow>>([]);

  const lastQueryRef = useRef<{ entidadId?: number; cicloVida?: string }>({});

  const searchTimeout = useRef<number | null>(null);

  const authHeaders = useMemo(
    () =>
      token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    [token]
  );

  const loadEntidades = useCallback(
    async (q?: string) => {
      try {
        const { data } = await axios.get<Entidad[]>(
          `${apiBaseUrl}/reportesms/allentidades`,
          {
            params: q ? { q } : undefined,
            headers: { ...authHeaders },
          }
        );
        setEntidades(data || []);
      } catch (e) {
        const err = e as AxiosError;
        console.error(err);
        message.error("No se pudieron cargar las entidades.");
      }
    },
    [apiBaseUrl, authHeaders]
  );

  const loadCiclos = useCallback(async () => {
    try {

        const { data } = await axios.get<CicloDeVida[]>(
        `${apiBaseUrl}/reportes/202/getciclosvida`,
        { headers: { ...authHeaders } }
      );
      if (Array.isArray(data) && data.length > 0) {
        setCiclos(data);
      } else {

      }
    } catch {
    }
  }, [apiBaseUrl, authHeaders]);

  useEffect(() => {
    loadEntidades();
    loadCiclos();
  }, [loadEntidades, loadCiclos]);

  useEffect(() => {
  const saved = localStorage.getItem("rep202_filters");
  if (saved) {
    const s = JSON.parse(saved);
    setEntidadId(s.entidadId ?? undefined);
    setCicloVida(s.cicloVida ?? undefined);
    setPage(s.page ?? 1);
    setPageSize(s.pageSize ?? 20);
    lastQueryRef.current = { entidadId: s.entidadId, cicloVida: s.cicloVida };
  }
}, []);

useEffect(() => {
  localStorage.setItem(
    "rep202_filters",
    JSON.stringify({ entidadId, cicloVida, page, pageSize })
  );
}, [entidadId, cicloVida, page, pageSize]);


  const loadColumns = useCallback(
    async (sample?: ReportRow) => {
      try {
        const { data } = await axios.get<string[]>(
          `${apiBaseUrl}/reportes/202/columns`,
          { headers: { ...authHeaders } }
        );
        if (Array.isArray(data) && data.length > 0) {
          const cols: ColumnsType<ReportRow> = data.map((key) => ({
            title: key.toUpperCase(),
            dataIndex: key,
            key,
            ellipsis: true,
          }));
          setColumns(cols);
          return;
        }
      } catch {
        //Inicial mente colocamos datos de prueba si no se recibía nada del API
      }
      if (sample) {
        const keys = Object.keys(sample);
        const cols: ColumnsType<ReportRow> = keys.map((key) => ({
          title: key.toUpperCase(),
          dataIndex: key,
          key,
          ellipsis: true,
        }));
        setColumns(cols);
      } else {
        // columnas mínimas para mostrar si no teníamos datos
        setColumns([
          { title: "TIPO_DOC", dataIndex: "tipo_doc", key: "tipo_doc", ellipsis: true },
          { title: "NUM_DOC", dataIndex: "num_doc", key: "num_doc", ellipsis: true },
          { title: "SEXO", dataIndex: "sexo", key: "sexo", ellipsis: true },
          { title: "EDAD", dataIndex: "edad", key: "edad", ellipsis: true },
        ]);
      }
    },
    [apiBaseUrl, authHeaders]
  );

  /* =========================
     Carga de datos
     ========================= */
  const fetchData = useCallback(
    async (params: FetchParams) => {
      setLoading(true);
      try {
        const { data } = await axios.get<ApiListResponse>(
          `${apiBaseUrl}/reportes/202/datareport202`,
          {
            headers: { ...authHeaders },
            params: {
              entidadId: params.entidadId,
              cicloVida: params.cicloVida,
              page: params.page,
              pageSize: params.pageSize,
            },
          }
        );

        setRows(data.data || []);
        setTotal(data.total || 0);


        if (columns.length === 0) {
          await loadColumns(data.data?.[0]);
        }
      } catch (e) {
        const err = e as AxiosError;
        console.error(err);
        message.error("No se pudieron cargar los datos del reporte 202.");
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl, authHeaders, columns.length, loadColumns]
  );

  // Acción Buscar
  const handleBuscar = useCallback(() => {
    setPage(1);
    lastQueryRef.current = { entidadId, cicloVida };
    fetchData({ entidadId, cicloVida, page: 1, pageSize });
  }, [entidadId, cicloVida, pageSize, fetchData]);

  // Paginación
  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      const newPage = pagination.current || 1;
      const newPageSize = pagination.pageSize || pageSize;
      setPage(newPage);
      setPageSize(newPageSize);
      const q = lastQueryRef.current;
      fetchData({
        entidadId: q.entidadId,
        cicloVida: q.cicloVida,
        page: newPage,
        pageSize: newPageSize,
      });
    },
    [fetchData, pageSize]
  );

  // Exportar CSV con el último query
  const handleExport = useCallback(async () => {
    const q = lastQueryRef.current;
    try {
      const { data } = await axios.get<ApiListResponse>(
        `${apiBaseUrl}/api/reportes/202`,
        {
          headers: { ...authHeaders },
          params: {
            entidadId: q.entidadId,
            cicloVida: q.cicloVida,
            page: 1,
            pageSize: 100000, 
          },
        }
      );
      const list = data.data || [];
      if (list.length === 0) {
        message.info("No hay registros para exportar con los filtros actuales.");
        return;
      }
      downloadCSV(list, "reporte_202.csv");
    } catch (e) {
      console.error(e);
      message.error("No se pudo exportar el CSV.");
    }
  }, [apiBaseUrl, authHeaders]);

  // Búsqueda remota de entidades
const handleSearchEntidad = useCallback(
  (value: string) => {
    const v = value?.trim();
    if (searchTimeout.current) window.clearTimeout(searchTimeout.current);
    searchTimeout.current = window.setTimeout(() => {
      if (v.length >= 2) loadEntidades(v);
    }, 400);
  },
  [loadEntidades]
);

  // UI columns
  const tableColumns = useMemo(() => {
    return (columns || []).map((c) => ({
      ...c,
      width: 160,
    }));
  }, [columns]);

  return (
    <div style={{ padding: 12 }}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Card
            size="small"
            style={{ borderRadius: 14 }}
            title={
              <Space>
                <FileTextOutlined />
                <Title level={5} style={{ margin: 0 }}>
                  Reporte Resolución 202
                </Title>
              </Space>
            }
            extra={
              <Space>
                <Tooltip title="Limpiar filtros">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setEntidadId(undefined);
                      setCicloVida(undefined);
                      setRows([]);
                      setTotal(0);
                      setPage(1);
                      setPageSize(20);
                      lastQueryRef.current = {};
                    }}
                  />
                </Tooltip>
                <Tooltip title="Exportar CSV">
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    disabled={rows.length === 0}
                  >
                    Exportar
                  </Button>
                </Tooltip>
              </Space>
            }
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} md={12} lg={8}>
                <Text style={{ display: "block", marginBottom: 6 }}>Entidad</Text>
                <Select<number>
                  showSearch
                  allowClear
                  placeholder="Selecciona una entidad"
                  value={entidadId}
                  onChange={(v) => setEntidadId(v)}
                  onSearch={handleSearchEntidad}
                  filterOption={false}
                  options={entidades.map((e) => ({
                    value: e.id,
                    label: e.codigo ? `${e.nombre} (${e.codigo})` : e.nombre,
                  }))}
                  style={{ width: "100%" }}
                />
              </Col>

              <Col xs={24} md={12} lg={8}>
                <Text style={{ display: "block", marginBottom: 6 }}>Ciclo de vida</Text>
                <Select<string>
                  allowClear
                  placeholder="Selecciona un ciclo de vida"
                  value={cicloVida}
                  onChange={(v) => setCicloVida(v)}
                  options={ciclos.map((c) => ({ value: c.id, label: c.nombre }))}
                  style={{ width: "100%" }}
                />
              </Col>

              <Col xs={24} md={12} lg={8}>
                <Text style={{ display: "block", marginBottom: 6, opacity: 0 }}>
                  _
                </Text>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleBuscar}
                  block
                  style={{maxWidth: "85px"}}
                >
                  Buscar
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            size="small"
            style={{ borderRadius: 14 }}
            styles={{ body: { padding: 0 } }} 
          >
            <Table<ReportRow>
              size="middle"
              rowKey={(_, index) => String(index)}
              columns={tableColumns}
              dataSource={rows}
              loading={loading}
              sticky


                pagination={{
                    current: page,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100],
                    onChange: (cp, ps) => handleTableChange({ current: cp, pageSize: ps }),
                    showTotal: (t) => `Total: ${t} registros`,
                }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Sin datos. Aplica filtros y presiona Buscar."
                  />
                ),
              }}
              scroll={{ x: tableColumns.length * 160, y: 520 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reporte202;
