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
  consulta_id: number;
  afiliados_id: number;
  pacientes_id: number;
  fecha_consulta: string;
  tipo_documento: string;
  documento: string;
  nombres: string;
  segundo_nombre: string;
  apellidos: string;
  segundo_apellido: string;
  genero: string;
  escolaridad_nombre: string;
  fecha_nacimiento: string;
  edad_anios: number;
  peso_kg: string;
  talla: string;
  Respuesta_al_estimulo_sonoro: string;
  Agudeza_Visual_OI: string;
  Agudeza_Visual_OD: string;
  Resultados_EAD3: string;

  ResultadoTipoTexto_907008: string;
  ResultadoTipoFecha_907008: string;
  ResultadoTipoNumerico_907008: string;

  ResultadoTipoTexto_452301: string;
  ResultadoTipoFecha_452301: string;
  ResultadoTipoNumerico_452301: string;

  ResultadoTipoTexto_452305: string;
  ResultadoTipoFecha_452305: string;
  ResultadoTipoNumerico_452305: string;

  ResultadoTipoTexto_906263: string;
  ResultadoTipoFecha_906263: string;
  ResultadoTipoNumerico_906263: string;

  ResultadoTipoTexto_673201: string;
  ResultadoTipoFecha_673201: string;
  ResultadoTipoNumerico_673201: string;

  ResultadoTipoTexto_903841: string;
  ResultadoTipoFecha_903841: string;
  ResultadoTipoNumerico_903841: string;

  ResultadoTipoTexto_903817: string;
  ResultadoTipoFecha_903817: string;
  ResultadoTipoNumerico_903817: string;

  ResultadoTipoTexto_906610: string;
  ResultadoTipoFecha_906610: string;
  ResultadoTipoNumerico_906610: string;

  ResultadoTipoTexto_906611: string;
  ResultadoTipoFecha_906611: string;
  ResultadoTipoNumerico_906611: string;

  ResultadoTipoTexto_906317: string;
  ResultadoTipoFecha_906317: string;
  ResultadoTipoNumerico_906317: string;

  ResultadoTipoTexto_906915: string;
  ResultadoTipoFecha_906915: string;
  ResultadoTipoNumerico_906915: string;

  ResultadoTipoTexto_906249: string;
  ResultadoTipoFecha_906249: string;
  ResultadoTipoNumerico_906249: string;

  ResultadoTipoTexto_908890: string;
  ResultadoTipoFecha_908890: string;
  ResultadoTipoNumerico_908890: string;

  ResultadoTipoTexto_702203: string;
  ResultadoTipoFecha_702203: string;
  ResultadoTipoNumerico_702203: string;

  ResultadoTipoTexto_898101: string;
  ResultadoTipoFecha_898101: string;
  ResultadoTipoNumerico_898101: string;

  ResultadoTipoTexto_903815: string;
  ResultadoTipoFecha_903815: string;
  ResultadoTipoNumerico_903815: string;

  ResultadoTipoTexto_881201: string;
  ResultadoTipoFecha_881201: string;
  ResultadoTipoNumerico_881201: string;

  ResultadoTipoTexto_903868: string;
  ResultadoTipoFecha_903868: string;
  ResultadoTipoNumerico_903868: string;

  ResultadoTipoTexto_851102: string;
  ResultadoTipoFecha_851102: string;
  ResultadoTipoNumerico_851102: string;

  ResultadoTipoTexto_902210: string;
  ResultadoTipoFecha_902210: string;
  ResultadoTipoNumerico_902210: string;

  ResultadoTipoTexto_903895: string;
  ResultadoTipoFecha_903895: string;
  ResultadoTipoNumerico_903895: string;

  ResultadoTipoTexto_901101: string;
  ResultadoTipoFecha_901101: string;
  ResultadoTipoNumerico_901101: string;
}

interface Entidad {
  id: number;
  nombre: string;
  codigo?: string;
}

interface FetchParams {
  entidadId?: number;
  cicloVida?: number;
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

interface CicloDeVida {
  id: number;
  nombre: string;
  edadMinAnios: number | null;
  edadMaxAnios: number | null;
}

/* =========================
   Orden fijo de columnas/CSV
   ========================= */
const FIELD_ORDER: (keyof ReportRow)[] = [
  "consulta_id",
  "afiliados_id",
  "pacientes_id",
  "fecha_consulta",
  "tipo_documento",
  "documento",
  "nombres",
  "segundo_nombre",
  "apellidos",
  "segundo_apellido",
  "genero",
  "escolaridad_nombre",
  "fecha_nacimiento",
  "edad_anios",
  "peso_kg",
  "talla",
  "Respuesta_al_estimulo_sonoro",
  "Agudeza_Visual_OI",
  "Agudeza_Visual_OD",
  "Resultados_EAD3",

  "ResultadoTipoTexto_907008",
  "ResultadoTipoFecha_907008",
  "ResultadoTipoNumerico_907008",

  "ResultadoTipoTexto_452301",
  "ResultadoTipoFecha_452301",
  "ResultadoTipoNumerico_452301",

  "ResultadoTipoTexto_452305",
  "ResultadoTipoFecha_452305",
  "ResultadoTipoNumerico_452305",

  "ResultadoTipoTexto_906263",
  "ResultadoTipoFecha_906263",
  "ResultadoTipoNumerico_906263",

  "ResultadoTipoTexto_673201",
  "ResultadoTipoFecha_673201",
  "ResultadoTipoNumerico_673201",

  "ResultadoTipoTexto_903841",
  "ResultadoTipoFecha_903841",
  "ResultadoTipoNumerico_903841",

  "ResultadoTipoTexto_903817",
  "ResultadoTipoFecha_903817",
  "ResultadoTipoNumerico_903817",

  "ResultadoTipoTexto_906610",
  "ResultadoTipoFecha_906610",
  "ResultadoTipoNumerico_906610",

  "ResultadoTipoTexto_906611",
  "ResultadoTipoFecha_906611",
  "ResultadoTipoNumerico_906611",

  "ResultadoTipoTexto_906317",
  "ResultadoTipoFecha_906317",
  "ResultadoTipoNumerico_906317",

  "ResultadoTipoTexto_906915",
  "ResultadoTipoFecha_906915",
  "ResultadoTipoNumerico_906915",

  "ResultadoTipoTexto_906249",
  "ResultadoTipoFecha_906249",
  "ResultadoTipoNumerico_906249",

  "ResultadoTipoTexto_908890",
  "ResultadoTipoFecha_908890",
  "ResultadoTipoNumerico_908890",

  "ResultadoTipoTexto_702203",
  "ResultadoTipoFecha_702203",
  "ResultadoTipoNumerico_702203",

  "ResultadoTipoTexto_898101",
  "ResultadoTipoFecha_898101",
  "ResultadoTipoNumerico_898101",

  "ResultadoTipoTexto_903815",
  "ResultadoTipoFecha_903815",
  "ResultadoTipoNumerico_903815",

  "ResultadoTipoTexto_881201",
  "ResultadoTipoFecha_881201",
  "ResultadoTipoNumerico_881201",

  "ResultadoTipoTexto_903868",
  "ResultadoTipoFecha_903868",
  "ResultadoTipoNumerico_903868",

  "ResultadoTipoTexto_851102",
  "ResultadoTipoFecha_851102",
  "ResultadoTipoNumerico_851102",

  "ResultadoTipoTexto_902210",
  "ResultadoTipoFecha_902210",
  "ResultadoTipoNumerico_902210",

  "ResultadoTipoTexto_903895",
  "ResultadoTipoFecha_903895",
  "ResultadoTipoNumerico_903895",

  "ResultadoTipoTexto_901101",
  "ResultadoTipoFecha_901101",
  "ResultadoTipoNumerico_901101",
];

/* =========================
   Utilidades
   ========================= */
function downloadCSVOrdered(rows: ReportRow[], filename = "reporte_202.csv") {
  if (!rows || rows.length === 0) {
    message.warning("No hay datos para exportar.");
    return;
  }
  const headers = FIELD_ORDER as string[];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const v = (r as any)[h];
          if (v === null || v === undefined) return "";
          const s = String(v).replace(/"/g, '""');
          if (/[",\n]/.test(s)) return `"${s}"`;
          return s;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* =========================
   Componente principal
   ========================= */
const Reporte202: React.FC<Reporte202Props> = ({ apiBaseUrl, token }) => {
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [ciclos, setCiclos] = useState<CicloDeVida[]>([]);
  const [entidadId, setEntidadId] = useState<number | undefined>(undefined);
  const [cicloVida, setCicloVida] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [columns, setColumns] = useState<ColumnsType<ReportRow>>([]);

  const lastQueryRef = useRef<{ entidadId?: number; cicloVida?: number }>({});

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
      }
    } catch (e) {
      console.error(e);
      message.error("No se pudieron cargar los ciclos de vida.");
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

  const buildFixedColumns = useCallback((): ColumnsType<ReportRow> => {
    return FIELD_ORDER.map((key) => ({
      title: String(key).toUpperCase(),
      dataIndex: key as string,
      key: key as string,
      ellipsis: true,
      width: 160,
    }));
  }, []);

  const loadColumns = useCallback(async () => {
    // Si quieres seguir usando un endpoint de columnas, puedes intentar aquí.
    // Si no responde, usamos el orden fijo FIELD_ORDER.
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
          width: 160,
        }));
        setColumns(cols);
        return;
      }
    } catch (e) {
      // ignoramos y usamos columnas fijas
    }
    setColumns(buildFixedColumns());
  }, [apiBaseUrl, authHeaders, buildFixedColumns]);

  /* =========================
     Carga de datos
     ========================= */
  const fetchData = useCallback(
    async (params: FetchParams) => {
      setLoading(true);
      try {
        console.log(entidadId)
        const { data } = await axios.get<ApiListResponse>(
          `${apiBaseUrl}/reportesms/202/datareport202/report-pra-infancia`,
          {
            headers: { ...authHeaders },
            params: {
              entidadId: entidadId,
              cicloVida: params.cicloVida,
              page: params.page,
              pageSize: params.pageSize,
            },
          }
        );

        setRows(data.data || []);
        setTotal(data.total || 0);

        if (columns.length === 0) {
          await loadColumns();
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

  // Exportar CSV con el último query (mismo endpoint, pageSize grande)
  const handleExport = useCallback(async () => {
    const q = lastQueryRef.current;
    try {
      const { data } = await axios.get<ApiListResponse>(
        `${apiBaseUrl}/reportes/202/datareport202`,
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
      downloadCSVOrdered(list, "reporte_202.csv");
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

  // Columnas a UI (ya incluyen width 160)
  const tableColumns = useMemo(() => columns, [columns]);

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
                <Text style={{ display: "block", marginBottom: 6 }}>
                  Ciclo de vida
                </Text>
                <Select<number>
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
                  style={{ maxWidth: "85px" }}
                >
                  Buscar
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card size="small" style={{ borderRadius: 14 }} styles={{ body: { padding: 0 } }}>
            <Table<ReportRow>
              size="middle"
              rowKey={(r) => String(r.consulta_id ?? Math.random())}
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
              scroll={{ x: (tableColumns?.length || 0) * 160, y: 520 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reporte202;
