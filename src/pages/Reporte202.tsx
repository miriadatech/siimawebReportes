// src/features/reporte202/Reporte202.tsx
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
  Form,
  DatePicker,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  FileTextOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";

import { getDefaultCurrentQuarterRange } from "../features/reporte202/dateUtils";
import { buildColumnsFromSpec, normalizeRowsByCiclo } from "../features/reporte202/tableUtils";
import { COMMON_DISPLAY_COLS } from "../features/reporte202/displayConfig";
import { exportRes202CSV } from "../features/reporte202/exportUtils";
import type { CanonicalRow, RawRow } from "../features/reporte202/cicloConfig";

const { Title } = Typography;

/* =========================
   Tipos de apoyo
   ========================= */
interface Entidad {
  id: number;
  nombre: string;
  codigo?: string;
}
interface CicloDeVida {
  id: number;
  nombre: string;
  edadMinAnios: number | null;
  edadMaxAnios: number | null;
}
interface Reporte202Props {
  apiBaseUrl: string;
  token?: string | null;
}
interface ApiListResponse<T = RawRow> {
  data: T[];
  total: number;
}
interface FetchParams {
  entidadId?: number;
  cicloVida?: number;
  page: number;
  pageSize: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

/* =========================
   Componente
   ========================= */
const Reporte202: React.FC<Reporte202Props> = ({ apiBaseUrl, token }) => {
  const [form] = Form.useForm();

  // Combos
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [ciclos, setCiclos] = useState<CicloDeVida[]>([]);

  // Filtros (estado canónico)
  const [entidadId, setEntidadId] = useState<number | undefined>(undefined);
  const [cicloVida, setCicloVida] = useState<number | undefined>(undefined);

  // Tabla
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<CanonicalRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [columns, setColumns] = useState<ColumnsType<CanonicalRow>>([]);

  // Miscelánea
  const lastQueryRef = useRef<{
    entidadId?: number;
    cicloVida?: number;
    fechaIni?: string;
    fechaFin?: string;
  }>({});
  const entidadCodigoRef = useRef<string | undefined>(undefined);
  const searchTimeout = useRef<number | null>(null);

  // Headers auth
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  /* =========================
     Watchers del Form
     ========================= */
  const watchedEntidadId = Form.useWatch<number | undefined>("entidadId", form);
  const watchedCicloVida = Form.useWatch<number | undefined>("cicloVida", form);

  useEffect(() => {
    setEntidadId(typeof watchedEntidadId === "number" ? watchedEntidadId : undefined);
  }, [watchedEntidadId]);

  useEffect(() => {
    setCicloVida(typeof watchedCicloVida === "number" ? watchedCicloVida : undefined);
  }, [watchedCicloVida]);

  /* =========================
     Carga inicial de combos
     ========================= */
  const loadEntidades = useCallback(
    async (q?: string) => {
      try {
        const { data } = await axios.get<Entidad[]>(
          `${apiBaseUrl}/reportesms/allentidades`,
          { params: q ? { q } : undefined, headers: { ...authHeaders } }
        );
        setEntidades(data || []);
      } catch (e) {
        console.error(e);
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
      if (Array.isArray(data) && data.length > 0) setCiclos(data);
    } catch (e) {
      console.error(e);
      message.error("No se pudieron cargar los ciclos de vida.");
    }
  }, [apiBaseUrl, authHeaders]);

  useEffect(() => {
    loadEntidades();
    loadCiclos();
  }, [loadEntidades, loadCiclos]);

  /* =========================
     Defaults + persistencia
     ========================= */
  // Fija las columnas de la VISTA (comunes) una sola vez
  useEffect(() => {
    setColumns(buildColumnsFromSpec(COMMON_DISPLAY_COLS));
  }, []);

  // Defaults de fechas = trimestre actual + restauro persistencia
  useEffect(() => {
    const saved = localStorage.getItem("rep202_filters");
    const { fechaIni, fechaFin } = getDefaultCurrentQuarterRange();

    if (saved) {
      const s = JSON.parse(saved);
      const ent = s.entidadId != null ? Number(s.entidadId) : undefined;
      const cic = s.cicloVida != null ? Number(s.cicloVida) : undefined;
      const fiStr = typeof s.fechaIni === "string" ? s.fechaIni : fechaIni;
      const ffStr = typeof s.fechaFin === "string" ? s.fechaFin : fechaFin;

      form.setFieldsValue({
        entidadId: ent,
        cicloVida: cic,
        fechaIni: dayjs(fiStr),
        fechaFin: dayjs(ffStr),
      });

      setPage(s.page ?? 1);
      setPageSize(s.pageSize ?? 20);

      lastQueryRef.current = {
        entidadId: ent,
        cicloVida: cic,
        fechaIni: fiStr,
        fechaFin: ffStr,
      };
      return;
    }

    form.setFieldsValue({
      fechaIni: dayjs(fechaIni),
      fechaFin: dayjs(fechaFin),
    });
  }, [form]);

  // Guardar persistencia al cambiar filtros/paginación
  useEffect(() => {
    const vals = form.getFieldsValue();
    localStorage.setItem(
      "rep202_filters",
      JSON.stringify({
        entidadId,
        cicloVida,
        page,
        pageSize,
        fechaIni: vals?.fechaIni ? vals.fechaIni.format("YYYY-MM-DD") : undefined,
        fechaFin: vals?.fechaFin ? vals.fechaFin.format("YYYY-MM-DD") : undefined,
      })
    );
  }, [entidadId, cicloVida, page, pageSize, form]);

  /* =========================
     Utils: endpoint por ciclo
     ========================= */
  const getUrlByCiclo = (ciclo?: number) => {
    switch (Number(ciclo)) {
      case 1:
        return `${apiBaseUrl}/reportesms/202/datareport202/report-pra-infancia`;
      case 2:
        return `${apiBaseUrl}/reportesms/202/datareport202/report-infancia`;
      case 3:
        return `${apiBaseUrl}/reportesms/202/datareport202/report-adolescencia`;
      case 4:
        return `${apiBaseUrl}/reportesms/202/datareport202/report-juventud`;
      case 5:
        return `${apiBaseUrl}/reportesms/202/datareport202/report-adultez`;
      case 6:
        return `${apiBaseUrl}/reportesms/202/datareport202/report-vejez`;
      default:
        return ``;
    }
  };

  /* =========================
     Fetch de datos (una sola petición)
     ========================= */
  const fetchData = useCallback(
    async (params: FetchParams) => {
      setLoading(true);
      const urlApi = getUrlByCiclo(params.cicloVida);
      console.log(urlApi)
      try {
        const { data } = await axios.get<ApiListResponse<RawRow>>(urlApi, {
          headers: { ...authHeaders },
          params: {
            entidadId: Number(params.entidadId),
            cicloVida: Number(params.cicloVida),
            page: 1,
            pageSize: 100000, // traemos todo
            startDate: params.startDate,
            endDate: params.endDate,
          },
        });

        // Normaliza (si definiste normalizadores por ciclo)
        console.log(data)
        const full = (data?.data ?? []) as RawRow[];
        const normalized = normalizeRowsByCiclo(full, Number(params.cicloVida));
        setRows(normalized);
        setTotal(normalized.length);
      } catch (e) {
        const err = e as AxiosError;
        console.error(err);
        message.error("No se pudieron cargar los datos del reporte 202.");
      } finally {
        setLoading(false);
      }
    },
    [authHeaders]
  );

  /* =========================
     Handlers
     ========================= */
  const handleBuscar = useCallback(() => {
    const ent: number | undefined = form.getFieldValue("entidadId");
    const cic: number | undefined = form.getFieldValue("cicloVida");
    const fi = form.getFieldValue("fechaIni"); // dayjs
    const ff = form.getFieldValue("fechaFin"); // dayjs

    if (ent == null || cic == null) {
      message.warning("Selecciona una entidad y un ciclo de vida.");
      return;
    }

    const fiStr = fi ? fi.format("YYYY-MM-DD") : undefined;
    const ffStr = ff ? ff.format("YYYY-MM-DD") : undefined;

    setEntidadId(ent);
    setCicloVida(cic);
    setPage(1);

    lastQueryRef.current = {
      entidadId: ent,
      cicloVida: cic,
      fechaIni: fiStr,
      fechaFin: ffStr,
    };

    // ÚNICA petición: datos
    fetchData({
      entidadId: ent,
      cicloVida: cic,
      page: 1,
      pageSize,
      startDate: fiStr,
      endDate: ffStr,
    });
  }, [form, pageSize, fetchData]);

  const handleReset = useCallback(() => {
    // Limpia entidad/ciclo y restaura fechas al trimestre actual
    const { fechaIni, fechaFin } = getDefaultCurrentQuarterRange();
    form.resetFields(["entidadId", "cicloVida"]);
    form.setFieldsValue({
      fechaIni: dayjs(fechaIni),
      fechaFin: dayjs(fechaFin),
    });

    setEntidadId(undefined);
    setCicloVida(undefined);
    setRows([]);
    setTotal(0);
    setPage(1);
    setPageSize(20);
    lastQueryRef.current = {};
    entidadCodigoRef.current = undefined;
  }, [form]);

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      const newPage = pagination.current || 1;
      const newPageSize = pagination.pageSize || pageSize;
      setPage(newPage);
      setPageSize(newPageSize);
    },
    [pageSize]
  );

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

  const handleExportFull202 = useCallback(() => {
    if (!rows.length) {
      message.info("No hay registros para exportar con los filtros actuales.");
      return;
    }
    // Exporta TODO el esquema 202, sin importar las columnas visibles
    exportRes202CSV(rows as any[], cicloVida, "reporte_202_full.csv");
  }, [rows, cicloVida]);

  /* =========================
     Derivados (memo)
     ========================= */
  const entidadOptions = useMemo(
    () =>
      entidades.map((e) => ({
        value: Number(e.id),
        label: e.codigo ? `${e.nombre} (${e.codigo})` : e.nombre,
        codigo: e.codigo,
      })),
    [entidades]
  );

  const cicloOptions = useMemo(
    () =>
      ciclos.map((c) => ({
        value: Number(c.id),
        label: c.nombre,
      })),
    [ciclos]
  );

  const tableColumns = useMemo(() => columns, [columns]);
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }, [rows, page, pageSize]);

  /* =========================
     Render
     ========================= */
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
              <Space wrap>
                <Tooltip title="Limpiar filtros y volver al trimestre actual">
                  <Button icon={<ReloadOutlined />} onClick={handleReset} />
                </Tooltip>

                <Tooltip title="Generar CSV con todos los campos de la Resolución 202">
                  <Button type="primary" onClick={handleExportFull202}>
                    Generar Reporte 202
                  </Button>
                </Tooltip>
              </Space>
            }
          >
            <Form form={form} layout="vertical">
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Entidad" name="entidadId">
                    <Select
                      showSearch
                      allowClear
                      placeholder="Selecciona una entidad"
                      onSearch={handleSearchEntidad}
                      filterOption={false}
                      optionFilterProp="label"
                      options={entidadOptions}
                      style={{ width: "100%" }}
                      onSelect={(_, option) => {
                        entidadCodigoRef.current = (option as any)?.codigo;
                      }}
                      onClear={() => {
                        entidadCodigoRef.current = undefined;
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Ciclo de vida" name="cicloVida">
                    <Select
                      allowClear
                      placeholder="Selecciona un ciclo de vida"
                      optionFilterProp="label"
                      options={cicloOptions}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} lg={8}>
                  <Form.Item label=" " colon={false}>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={handleBuscar}
                      block
                      style={{ maxWidth: 120 }}
                    >
                      Buscar
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              {/* Fechas: 2 DatePicker (no RangePicker) con default = trimestre actual */}
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Fecha inicial" name="fechaIni">
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" allowClear={false} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Fecha final" name="fechaFin">
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" allowClear={false} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col span={24}>
          <Card size="small" style={{ borderRadius: 14 }} styles={{ body: { padding: 0 } }}>
            <Table<CanonicalRow>
              size="middle"
              rowKey={(r) => String(r.consulta_id ?? r.numero_identificacion ?? Math.random())}
              columns={tableColumns}
              dataSource={paginatedRows}
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
