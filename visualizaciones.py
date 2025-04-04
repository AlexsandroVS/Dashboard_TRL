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
            yanchor="bottom",
            y=-0.25,
            xanchor="center",
            x=0.5
        )
    )

def graficos_generales(df, columna_industria, columna_ingles, columna_ubicacion):
    # Paleta de colores 
    colors = {
        "Sí": "#27ae60",  # Verde
        "No": "#e74c3c",  # Rojo
        "TRL 1-3": "#3498db",  # Azul
        "TRL 4-7": "#9b59b6",  # Morado
        "TRL 8-9": "#e67e22",  # Naranja
        "Ubicación": ["#3498db", "#2ecc71", "#e74c3c", "#f1c40f", "#95a5a6"]  # Lima, Arequipa, Cusco, Huancayo, No especificada
    }

    # ------------------------------------------------------------------------------------
    # 1. Gráfico de Distribución por Segmento TRL (Barras verticales)
    # ------------------------------------------------------------------------------------
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
    fig1.update_traces(
        marker_line_color="white",
        marker_line_width=2,
        texttemplate="%{y}",
        textposition="outside",
        textfont_size=14
    )
    fig1.update_layout(
        **crear_layout("📊 Distribución por Nivel TRL"),
        xaxis_title="Segmento TRL",
        yaxis_title="Número de Proyectos",
        showlegend=False
    )

    # ------------------------------------------------------------------------------------
    # 2. Gráfico de Proporción de Aprobados (Donut)
    # ------------------------------------------------------------------------------------
    fig2 = px.pie(
        df,
        names="Aprobado",
        hole=0.4,
        color="Aprobado",
        color_discrete_map={"Sí": colors["Sí"], "No": colors["No"]},
        template="plotly_white"
    )
    fig2.update_traces(
        textinfo="percent+label",
        pull=[0.05, 0],
        marker_line_color="white",
        marker_line_width=2,
        textfont_size=14
    )
    fig2.update_layout(
        **crear_layout("✅ Proyectos Aprobados"),
        showlegend=False
    )

    # ------------------------------------------------------------------------------------
    # 3. Gráfico de Aprobación por Segmento TRL (Barras agrupadas)
    # ------------------------------------------------------------------------------------
    fig3 = px.histogram(
        df,
        x="Segmento TRL",
        color="Aprobado",
        barmode="group",
        color_discrete_map={"Sí": colors["Sí"], "No": colors["No"]},
        template="plotly_white"
    )
    fig3.update_traces(
        marker_line_color="white",
        marker_line_width=2
    )
    fig3.update_layout(
        **crear_layout("📈 Aprobación por Segmento TRL"),
        xaxis_title="Segmento TRL",
        yaxis_title="Número de Proyectos"
    )

    # ------------------------------------------------------------------------------------
    # 4. Gráfico de Distribución de Puntajes TRL 1-3 (Histograma)
    # ------------------------------------------------------------------------------------
    fig4 = px.histogram(
        df,
        x="Puntaje TRL 1-3",
        nbins=20,
        color_discrete_sequence=[colors["TRL 1-3"]],
        template="plotly_white"
    )
    fig4.update_traces(
        marker_line_color="white",
        marker_line_width=2
    )
    fig4.update_layout(
        **crear_layout("🔍 Distribución de Puntajes TRL 1-3"),
        xaxis_title="Puntaje",
        yaxis_title="Número de Proyectos"
    )

    # ------------------------------------------------------------------------------------
    # 5. Gráfico de Distribución por Industria (Barras horizontales)
    # ------------------------------------------------------------------------------------
    if columna_industria in df.columns:
        df["Industria"] = df[columna_industria].fillna("No especificada").astype(str).str.strip()
        conteo_industria = df["Industria"].value_counts().reset_index()
        conteo_industria.columns = ["Industria", "Cantidad"]
        
        fig5 = px.bar(
            conteo_industria,
            x="Cantidad",
            y="Industria",
            orientation="h",
            color="Industria",
            template="plotly_white"
        )
        fig5.update_traces(
            marker_line_color="white",
            marker_line_width=2
        )
        fig5.update_layout(
            **crear_layout("🏭 Proyectos por Industria"),
            xaxis_title="Número de Proyectos",
            yaxis_title="Industria",
            showlegend=False
        )
    else:
        fig5 = None

    # ------------------------------------------------------------------------------------
    # 6. Gráfico de Nivel de Inglés (Barras verticales)
    # ------------------------------------------------------------------------------------
    if columna_ingles in df.columns:
        df["Nivel de Inglés"] = df[columna_ingles].fillna("No especificado").str.strip().str.capitalize()
        conteo_ingles = df["Nivel de Inglés"].value_counts().reset_index()
        conteo_ingles.columns = ["Nivel", "Cantidad"]
        
        fig6 = px.bar(
            conteo_ingles,
            x="Nivel",
            y="Cantidad",
            color="Nivel",
            template="plotly_white"
        )
        fig6.update_traces(
            marker_line_color="white",
            marker_line_width=2
        )
        fig6.update_layout(
            **crear_layout("🌍 Nivel de Inglés"),
            xaxis_title="Nivel",
            yaxis_title="Número de Proyectos",
            showlegend=False
        )
    else:
        fig6 = None

    # ------------------------------------------------------------------------------------
    # 7. Gráfico de Ubicación Geográfica (Torta con efecto pull)
    # ------------------------------------------------------------------------------------
    if columna_ubicacion in df.columns:
        df["Ubicación"] = (
            df[columna_ubicacion]
            .astype(str)
            .str.strip()
            .str.capitalize()
            .replace({"Nan": "No especificada", "": "No especificada"})
        )
        conteo_ubicacion = df["Ubicación"].value_counts().reset_index()
        conteo_ubicacion.columns = ["Ubicación", "Cantidad"]
        
        fig7 = px.pie(
            conteo_ubicacion,
            names="Ubicación",
            values="Cantidad",
            hole=0.3,
            color="Ubicación",
            color_discrete_sequence=colors["Ubicación"],
            template="plotly_white"
        )
        fig7.update_traces(
            textinfo="percent+label",
            pull=[0.1 if x == "No especificada" else 0 for x in conteo_ubicacion["Ubicación"]],
            marker_line_color="white",
            marker_line_width=2,
            textfont_size=14
        )
        fig7.update_layout(
            **crear_layout("📍 Ubicación Geográfica"),
            showlegend=False
        )
    else:
        fig7 = None

    return fig1, fig2, fig3, fig4, fig5, fig6, fig7

def mostrar_en_pares(fig1, fig2, fig3, fig4, fig5=None, fig6=None, fig7=None):
    """Muestra los gráficos en un layout organizado por pares."""
    col1, col2 = st.columns(2)
    with col1:
        st.plotly_chart(fig1, use_container_width=True)
    with col2:
        st.plotly_chart(fig2, use_container_width=True)

    col3, col4 = st.columns(2)
    with col3:
        st.plotly_chart(fig3, use_container_width=True)
    with col4:
        st.plotly_chart(fig4, use_container_width=True)

    if fig5 and fig6:
        col5, col6 = st.columns(2)
        with col5:
            st.plotly_chart(fig5, use_container_width=True)
        with col6:
            st.plotly_chart(fig6, use_container_width=True)

    if fig7:
        st.plotly_chart(fig7, use_container_width=True)