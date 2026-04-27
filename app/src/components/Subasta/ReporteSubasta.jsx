    import { useEffect, useState } from "react";
    import subastaService from "@/services/SubastaService";
    import { Bar } from "react-chartjs-2";
    import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    } from "chart.js";
    import { Activity, CheckCircle, XCircle, Gavel, LayoutGrid } from "lucide-react";

    ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

    const ESTADOS = [
    { key: "activas",     label: "Activas",     icon: Activity,     color: "#C9A84C",                glow: "rgba(201,168,76,0.18)" },
    { key: "finalizadas", label: "Finalizadas", icon: CheckCircle,  color: "#F5F0E8",                glow: "rgba(245,240,232,0.1)" },
    { key: "canceladas",  label: "Canceladas",  icon: XCircle,      color: "rgba(245,240,232,0.35)", glow: "rgba(245,240,232,0.05)" },
    ];

    const FILTROS = [
    { key: "todos",       label: "Todos",       icon: LayoutGrid  },
    { key: "activas",     label: "Activas",     icon: Activity    },
    { key: "finalizadas", label: "Finalizadas", icon: CheckCircle },
    { key: "canceladas",  label: "Canceladas",  icon: XCircle     },
    ];

    export function Reporte() {
    const [data, setData] = useState({ activas: 0, finalizadas: 0, canceladas: 0 });
    const [filtro, setFiltro] = useState("todos");

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
        const response = await subastaService.getSubastasPorEstado();
        const datos = response.data.data;

        let activas = 0;
        let finalizadas = 0;
        let canceladas = 0;

        datos.forEach((item) => {
            const total = Number(item.total) || 0;
            switch (parseInt(item.idEstadoSubasta)) {
            case 1: activas = total; break;
            case 2: finalizadas = total; break;
            case 3: canceladas = total; break;
            default: break;
            }
        });

        setData({ activas, finalizadas, canceladas });
        } catch (error) {
        console.error(error);
        }
    };

    const total = data.activas + data.finalizadas + data.canceladas;

    // Estados visibles según filtro
    const estadosVisibles = filtro === "todos"
        ? ESTADOS
        : ESTADOS.filter((e) => e.key === filtro);

    // Gráfico: opacidad reducida en barras no seleccionadas
    const chartData = {
        labels: ["Activas", "Finalizadas", "Canceladas"],
        datasets: [
        {
            label: "Cantidad de Subastas",
            data: [data.activas, data.finalizadas, data.canceladas],
            backgroundColor: ESTADOS.map(({ key }) =>
            filtro === "todos" || filtro === key
                ? key === "activas"   ? "rgba(201,168,76,0.7)"
                : key === "finalizadas" ? "rgba(245,240,232,0.55)"
                : "rgba(245,240,232,0.18)"
                : "rgba(255,255,255,0.05)"
            ),
            borderColor: ESTADOS.map(({ key, color }) =>
            filtro === "todos" || filtro === key ? color : "rgba(255,255,255,0.08)"
            ),
            borderWidth: 1,
            borderRadius: 2,
            borderSkipped: false,
        },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#0E0D0B",
            borderColor: "rgba(201,168,76,0.25)",
            borderWidth: 1,
            titleColor: "rgba(245,240,232,0.4)",
            bodyColor: "#F5F0E8",
            padding: 12,
            cornerRadius: 0,
            titleFont: { size: 10, weight: "500" },
            bodyFont: { size: 14, weight: "300" },
        },
        },
        scales: {
        x: {
            grid: { display: false },
            ticks: { color: "rgba(245,240,232,0.4)", font: { size: 10, weight: "500" } },
            border: { color: "rgba(201,168,76,0.1)" },
        },
        y: {
            grid: { color: "rgba(201,168,76,0.06)", drawTicks: false },
            ticks: { color: "rgba(245,240,232,0.25)", font: { size: 10 }, padding: 10 },
            border: { display: false },
        },
        },
    };

    return (
        <div style={{ minHeight: "100vh", background: "#080807", color: "#F5F0E8", padding: "40px", fontFamily: "sans-serif" }}>

        {/* Encabezado */}
        <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "28px", height: "1px", background: "#C9A84C" }} />
            <span style={{ color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.4em", fontSize: "12px", fontWeight: 500 }}>
                Panel de Control
            </span>
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: 300, letterSpacing: "-0.5px", margin: 0 }}>
            Reporte de{" "}
            <em style={{ color: "#C9A84C", fontStyle: "normal" }}>Subastas</em>
            </h1>
        </div>

        {/* Pills de filtro */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,240,232,0.25)", marginRight: "4px" }}>
            Filtrar
            </span>
            {FILTROS.map(({ key, label, icon: Icon }) => {
            const isActive = filtro === key;
            const estadoColor = ESTADOS.find((e) => e.key === key)?.color ?? "#C9A84C";
            const activeColor = key === "todos" ? "#C9A84C" : estadoColor;
            return (
                <button
                key={key}
                onClick={() => setFiltro(key)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 16px",
                    border: isActive
                    ? `1px solid ${activeColor}`
                    : "1px solid rgba(245,240,232,0.1)",
                    background: isActive
                    ? key === "todos"
                        ? "rgba(201,168,76,0.12)"
                        : `${activeColor}18`
                    : "transparent",
                    color: isActive ? activeColor : "rgba(245,240,232,0.35)",
                    fontSize: "11px",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                }}
                >
                <Icon size={11} />
                {label}
                </button>
            );
            })}
        </div>

        {/* Tarjeta Total — destacada */}
        <div style={{ border: "1px solid rgba(201,168,76,0.25)", background: "#0E0D0B", padding: "28px 32px", marginBottom: "1px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(201,168,76,0.08)", filter: "blur(40px)", pointerEvents: "none" }} />
            <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Gavel size={14} color="#C9A84C" />
                <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)" }}>
                Total de Subastas
                </span>
            </div>
            <span style={{ fontSize: "56px", fontWeight: 300, color: "#C9A84C", lineHeight: 1, letterSpacing: "-2px" }}>
                {filtro === "todos" ? total : data[filtro]}
            </span>
            </div>
            <div style={{ display: "flex", gap: "32px" }}>
            {estadosVisibles.map(({ key, label, color }) => (
                <div key={key} style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "13px", color, fontWeight: 300 }}>
                    {total > 0 ? Number(((data[key] / total) * 100).toFixed(2)) : 0}%
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Tarjetas por estado */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${estadosVisibles.length}, 1fr)`, gap: "1px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.1)", borderTop: "none", marginBottom: "1px" }}>
            {estadosVisibles.map(({ key, label, icon: Icon, color, glow }) => (
            <div key={key} style={{ background: "#080807", padding: "28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: glow, filter: "blur(30px)", pointerEvents: "none" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Icon size={14} color={color} />
                <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)" }}>
                    {label}
                </span>
                </div>
                <span style={{ fontSize: "44px", fontWeight: 300, color, lineHeight: 1, letterSpacing: "-1px" }}>
                {data[key]}
                </span>
            </div>
            ))}
        </div>

        {/* Tabla + Gráfico */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.1)", borderTop: "none" }}>

            {/* Tabla */}
            <div style={{ background: "#0E0D0B", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "16px", height: "1px", background: "#C9A84C" }} />
                <span style={{ color: "#C9A84C", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase" }}>
                Detalle
                </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    {["Estado", "Cantidad"].map((h, i) => (
                    <th key={h} style={{ textAlign: i === 0 ? "left" : "right", fontSize: "10px", fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", padding: "0 0 12px", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
                        {h}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {estadosVisibles.map(({ key, label, color }, i) => (
                    <tr key={key}>
                    <td style={{ padding: "14px 0", fontSize: "13px", fontWeight: 300, color: "rgba(245,240,232,0.75)", borderBottom: i < estadosVisibles.length - 1 ? "1px solid rgba(201,168,76,0.06)" : "1px solid rgba(201,168,76,0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}`, display: "inline-block" }} />
                        {label}
                        </div>
                    </td>
                    <td style={{ padding: "14px 0", textAlign: "right", fontSize: "16px", fontWeight: 300, color, borderBottom: i < estadosVisibles.length - 1 ? "1px solid rgba(201,168,76,0.06)" : "1px solid rgba(201,168,76,0.1)" }}>
                        {data[key]}
                    </td>
                    </tr>
                ))}
                {/* Fila total */}
                <tr>
                    <td style={{ padding: "14px 0", fontSize: "13px", fontWeight: 500, color: "#C9A84C" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Gavel size={12} color="#C9A84C" />
                        {filtro === "todos" ? "Total" : "Subtotal"}
                    </div>
                    </td>
                    <td style={{ padding: "14px 0", textAlign: "right", fontSize: "18px", fontWeight: 400, color: "#C9A84C" }}>
                    {filtro === "todos" ? total : data[filtro]}
                    </td>
                </tr>
                </tbody>
            </table>
            </div>

            {/* Gráfico */}
            <div style={{ background: "#0E0D0B", padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "16px", height: "1px", background: "#C9A84C" }} />
                <span style={{ color: "#C9A84C", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase" }}>
                Distribución
                </span>
            </div>
            <Bar data={chartData} options={chartOptions} />
            </div>

        </div>
        </div>
    );
    }

    export default Reporte;