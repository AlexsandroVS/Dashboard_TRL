import plotly.express as px
import pandas as pd
from plotly.subplots import make_subplots
import plotly.graph_objects as go

def crear_layout(titulo):
    return dict(
        title={
            'text': f"<b>{titulo}</b>",
            'font': {'family': "Arial", 'size': 22, 'color': "#2c3e50"},
            'x': 0.5,
            'y': 0.95
        },
        font=dict(family="Arial", size=14, color="#34495e"),
        plot_bgcolor="#ffffff",
        paper_bgcolor="#f8f9fa",
        margin=dict(l=50, r=50, t=80, b=70),
        hoverlabel=dict(
            bgcolor="white",
            font_size=14,
            font_family="Arial",
            bordercolor="#bdc3c7"
        ),
        legend=dict(
            orientation="h",
            yanchor="top",
            y=-0.25,
            xanchor="center",
            x=0.5
        )
    )

def graficos_generales(df, columna_industria, columna_ingles, columna_ubicacion):
    colors = {
        "Sí": "#27ae60",
        "No": "#e74c3c",
        "TRL 1-3": "#3498db",
        "TRL 4-7": "#9b59b6",
        "TRL 8-9": "#e67e22",
        "Ubicación": ["#3498db", "#2ecc71", "#e74c3c", "#f1c40f", "#95a5a6"]
    }

    # -------- FIG 1: Distribución TRL
    conteo_segmento = df["Segmento TRL"].value_counts().reset_index()
    conteo_segmento.columns = ["Segmento TRL", "Cantidad"]
    
    fig1 = px.bar(
        conteo_segmento,
        x="Segmento TRL",
        y="Cantidad",
        color="Segmento TRL",
        color_discrete_map={
            "TRL 1-3": colors["TRL 1-3"],
            "TRL 4-7": colors["TRL 4-7"],
            "TRL 8-9": colors["TRL 8-9"]
        },
        template="plotly_white"
    )
    fig1.update_traces(marker_line_color="white", marker_line_width=2, texttemplate="%{y}", textposition="outside", textfont_size=14)
    fig1.update_layout(**crear_layout("📊 Distribución por Nivel TRL"), xaxis_title="Segmento TRL", yaxis_title="Número de Proyectos", showlegend=False, height=600)
    fig1.update_xaxes(tickangle=-30)

    # -------- FIG 2 y 4 en SUBPLOT
    fig2_4 = make_subplots(rows=1, cols=2, subplot_titles=("✅ Proyectos Aprobados", "🔍 Puntajes TRL 1-3"), specs=[[{"type": "domain"}, {"type": "xy"}]])

    # Gráfico 2: Pie
    pie2 = px.pie(df, names="Aprobado", hole=0.4, color="Aprobado", color_discrete_map={"Sí": colors["Sí"], "No": colors["No"]}, template="plotly_white")
    pie2.update_traces(textinfo="percent+label", pull=[0.05, 0], marker_line_color="white", marker_line_width=2, textfont_size=14)
    for trace in pie2.data:
        fig2_4.add_trace(trace, row=1, col=1)

    # Gráfico 4: Histograma
    hist4 = px.histogram(df, x="Puntaje TRL 1-3", nbins=20, color_discrete_sequence=[colors["TRL 1-3"]], template="plotly_white")
    hist4.update_traces(marker_line_color="white", marker_line_width=2)
    for trace in hist4.data:
        fig2_4.add_trace(trace, row=1, col=2)
    fig2_4.update_layout(**crear_layout(""), height=600)
    fig2_4.update_xaxes(title_text="Puntaje", row=1, col=2, tickangle=-30)
    fig2_4.update_yaxes(title_text="Número de Proyectos", row=1, col=2)
    fig2_4.update_layout(showlegend=False)

    # -------- FIG 3: Aprobación por TRL
    fig3 = px.histogram(df, x="Segmento TRL", color="Aprobado", barmode="group", color_discrete_map={"Sí": colors["Sí"], "No": colors["No"]}, template="plotly_white")
    fig3.update_traces(marker_line_color="white", marker_line_width=2)
    fig3.update_layout(**crear_layout("📈 Aprobación por Segmento TRL"), xaxis_title="Segmento TRL", yaxis_title="Número de Proyectos", height=600)
    fig3.update_xaxes(tickangle=-30)

    # -------- FIG 5: Industria
    if columna_industria in df.columns:
        df["Industria"] = df[columna_industria].fillna("No especificada").astype(str).str.strip()
        conteo_industria = df["Industria"].value_counts().reset_index()
        conteo_industria.columns = ["Industria", "Cantidad"]
        
        fig5 = px.bar(conteo_industria, x="Cantidad", y="Industria", orientation="h", color="Industria", template="plotly_white")
        fig5.update_traces(marker_line_color="white", marker_line_width=2)
        fig5.update_layout(**crear_layout("🏭 Proyectos por Industria"), xaxis_title="Número de Proyectos", yaxis_title="Industria", showlegend=False, height=600)
    else:
        fig5 = None

    # -------- FIG 6 y 7 en SUBPLOT
    if columna_ingles in df.columns and columna_ubicacion in df.columns:
        df["Nivel de Inglés"] = df[columna_ingles].fillna("No especificado").str.strip().str.capitalize()
        conteo_ingles = df["Nivel de Inglés"].value_counts().reset_index()
        conteo_ingles.columns = ["Nivel", "Cantidad"]

        df["Ubicación"] = df[columna_ubicacion].astype(str).str.strip().str.capitalize().replace({"Nan": "No especificada", "": "No especificada"})
        conteo_ubicacion = df["Ubicación"].value_counts().reset_index()
        conteo_ubicacion.columns = ["Ubicación", "Cantidad"]

        fig6_7 = make_subplots(rows=1, cols=2, subplot_titles=("🌍 Nivel de Inglés", "📍 Ubicación Geográfica"), specs=[[{"type": "xy"}, {"type": "domain"}]])

        # Bar (Inglés)
        bar6 = px.bar(conteo_ingles, x="Nivel", y="Cantidad", color="Nivel", template="plotly_white")
        bar6.update_traces(marker_line_color="white", marker_line_width=2)
        for trace in bar6.data:
            fig6_7.add_trace(trace, row=1, col=1)
        fig6_7.update_xaxes(title_text="Nivel", row=1, col=1, tickangle=-30)
        fig6_7.update_yaxes(title_text="Número de Proyectos", row=1, col=1)

        # Pie (Ubicación)
        pie7 = px.pie(conteo_ubicacion, names="Ubicación", values="Cantidad", hole=0.3, color="Ubicación", color_discrete_sequence=colors["Ubicación"], template="plotly_white")
        pie7.update_traces(textinfo="percent+label", pull=[0.1 if x == "No especificada" else 0 for x in conteo_ubicacion["Ubicación"]], marker_line_color="white", marker_line_width=2, textfont_size=14)
        for trace in pie7.data:
            fig6_7.add_trace(trace, row=1, col=2)

        fig6_7.update_layout(**crear_layout(""), height=600, showlegend=False)
    else:
        fig6_7 = None

    return fig1, fig2_4, fig3, fig5, fig6_7
