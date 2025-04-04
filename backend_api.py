from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
import pandas as pd
import numpy as np  
from auth import obtener_todas_las_entradas
from funciones import segmento_trl, calcular_puntajes_por_segmento, generar_insights
from data_loader import cargar_diccionario
from visualizaciones import graficos_generales
from urllib.parse import unquote
import re
import os

app = FastAPI()
security = HTTPBasic()

current_dir = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(current_dir, "templates")
static_dir = os.path.join(templates_dir, "static")

# Construir la ruta al directorio static
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Configurar templates
templates = Jinja2Templates(directory=templates_dir)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Aquí 
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todas las cabeceras
)

# Modelos de datos
class ProjectRequest(BaseModel):
    nombre: str

# Función para cargar y procesar datos
def cargar_y_procesar_datos():
    if not os.path.exists("datos_formularios.csv"):
        raise HTTPException(status_code=404, detail="Archivo de datos no encontrado")

    df = pd.read_csv("datos_formularios.csv")
    diccionario = cargar_diccionario("diccionario.csv")
    
    return procesar_datos_completos(df, diccionario)


# Procesamiento de datos
def procesar_datos_completos(df, diccionario):
    """Procesamiento completo de datos (unificado con main.py)"""
    df = df.rename(columns={
        "1": "Nombre del Proyecto",
        "14": "Nivel TRL",
        "15": "Docente Acompañante",
        "17": "Nivel de Inglés",
        "30": "Ubicación",
        "3": "Industria"  # Nueva columna necesaria para insights
    })
    
    # Procesamiento TRL
    df["Nivel TRL"] = pd.to_numeric(df["Nivel TRL"], errors="coerce").fillna(0)
    df["Segmento TRL"] = df["Nivel TRL"].apply(segmento_trl)
    
    # Inicializar columnas de puntajes
    for segmento in ["TRL 1-3", "TRL 4-7", "TRL 8-9"]:
        df[f"Puntaje {segmento}"] = 0.0
    df["Aprobado"] = "No"

    # Calcular puntajes con lógica de main.py
    for idx, row in df.iterrows():
        puntajes = calcular_puntajes_por_segmento(row, diccionario)
        
        # 🎯 Puntos adicionales (igual que main.py)
        extra = 0
        nivel_ingles = str(row.get("Nivel de Inglés", "")).strip().lower()
        if "intermedio" in nivel_ingles:
            extra += 2
        elif "avanzado" in nivel_ingles:
            extra += 4

        docente = str(row.get("Docente Acompañante", "")).strip().lower()
        if docente == "si":
            extra += 10

        # Asignar puntajes con extras
        for segmento in puntajes:
            df.at[idx, f"Puntaje {segmento}"] = puntajes[segmento] + extra

        if any((puntajes[seg] + extra) >= 50 for seg in puntajes):
            df.at[idx, "Aprobado"] = "Sí"

    # Procesar campos adicionales
    df["Docente Acompañante"] = df["Docente Acompañante"].astype(str).str.strip().str.upper() == "SI"
    df["Nivel de Inglés"] = df["Nivel de Inglés"].fillna("No especificado").str.strip().str.capitalize()
    
    # Agregar columna de puntaje total
    df["Puntaje Total"] = df["Puntaje TRL 1-3"] + df["Puntaje TRL 4-7"] + df["Puntaje TRL 8-9"]
    
    # Generar insights completos
    df["Insights"] = df.apply(lambda row: generar_insights(row, diccionario), axis=1)
    
    return df
# Endpoints
@app.post("/actualizar-datos")
async def actualizar_datos(credentials: HTTPBasicCredentials = Depends(security)):
    try:
        # Verificar si el archivo ya existe
        if os.path.exists("datos_formularios.csv"):
            df = pd.read_csv("datos_formularios.csv")  # Cargar el CSV existente
        else:
            df = obtener_todas_las_entradas(
                usuario=credentials.username,
                clave_app=credentials.password,
                url_base="https://fablab.ucontinental.edu.pe/wp-json/gf/v2/forms/9/entries"
            )
            df.to_csv("datos_formularios.csv", index=False)  # Guardar solo si no existe
        
        return {"mensaje": f"Datos cargados ({len(df)} registros)"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metricas-principales")
async def obtener_metricas():
    df = cargar_y_procesar_datos()
    
    metricas = {
        "formularios": len(df),
        "trl_max": int(df["Nivel TRL"].max()),
        "aprobados": int((df["Aprobado"] == "Sí").sum()),
        "docente_si": int(df["Docente Acompañante"].sum()),
        "docente_no": len(df) - int(df["Docente Acompañante"].sum())
    }
    
    return metricas


@app.get("/datos-graficos")
async def obtener_datos_graficos():
    df = cargar_y_procesar_datos()
    fig1, fig2, fig3, fig4, fig5, fig6, fig7 = graficos_generales(df, "Industria", "Nivel de Inglés", "Ubicación")
    return {
        "graficos": {
            "distribucion_trl": fig1.to_json(),
            "proporcion_aprobados": fig2.to_json(),
            "aprobacion_por_trl": fig3.to_json(),
            "puntaje_trl13": fig4.to_json(),
            "distribucion_industria": fig5.to_json(),
            "nivel_ingles": fig6.to_json(),
            "ubicacion_geografica": fig7.to_json()
        }
    }

@app.post("/buscar-proyecto")
async def buscar_proyecto(request: ProjectRequest):
    df = cargar_y_procesar_datos()
    
    # Asegurar que la columna "Nombre del Proyecto" existe
    if "Nombre del Proyecto" not in df.columns:
        raise HTTPException(status_code=400, detail="Columna 'Nombre del Proyecto' no encontrada")

    # Reemplazar NaN con valores vacíos antes de la búsqueda
    df = df.fillna("")

    # Buscar proyectos que coincidan con el nombre proporcionado
    resultados = df[df["Nombre del Proyecto"].str.contains(request.nombre, case=False, na=False)]

    if resultados.empty:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # Convertir a diccionario y asegurarse de que los valores NaN sean eliminados
    proyectos = resultados.replace({np.nan: None}).to_dict(orient="records")
    
    return {"proyectos": proyectos}

@app.get("/proyectos")
async def obtener_proyectos():
    df = cargar_y_procesar_datos()
    proyectos = df[[
        "Nombre del Proyecto", 
        "Aprobado", 
        "Puntaje TRL 1-3", 
        "Puntaje TRL 4-7", 
        "Puntaje TRL 8-9",
        "Puntaje Total",  # Nueva columna
        "Segmento TRL",
        "Industria",  # Nueva columna
        "Insights"
    ]].to_dict(orient="records")
    return {"proyectos": proyectos}


@app.get("/reporte-proyecto/{nombre}")
async def generar_reporte_proyecto(request: Request, nombre: str):
    df = cargar_y_procesar_datos()
    nombre_decodificado = unquote(nombre)
    
    proyecto = df[df["Nombre del Proyecto"].str.contains(re.escape(nombre_decodificado), case=False, na=False)]
    
    if proyecto.empty:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    proyecto = proyecto.iloc[0]
    
    # Generar insights mejorados
    insights_mejorados = generar_insights(proyecto)
    
    context = {
        "request": request,
        "fecha_generacion": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "nombre_proyecto": proyecto["Nombre del Proyecto"],
        "aprobado": proyecto["Aprobado"],
        "nivel_trl": proyecto["Nivel TRL"],
        "segmento_trl": proyecto["Segmento TRL"],
        "docente_acompanante": "Sí" if proyecto["Docente Acompañante"] else "No",
        "ubicacion": proyecto.get("Ubicación", "No especificada"),
        "nivel_ingles": proyecto.get("Nivel de Inglés", "No especificado"),
        "trl_1_3": proyecto["Puntaje TRL 1-3"],
        "trl_4_7": proyecto["Puntaje TRL 4-7"],
        "trl_8_9": proyecto["Puntaje TRL 8-9"],
        "insights": insights_mejorados  # Usar los nuevos insights
    }
    
    return templates.TemplateResponse("reports/reporte_template.html", context)

# Agregar este nuevo endpoint
@app.get("/insights-generales")
async def obtener_insights_generales():
    try:
        df = cargar_y_procesar_datos()

        # Asegurar que todas las columnas necesarias están convertidas a tipos nativos de Python
        df["Puntaje TRL 1-3"] = df["Puntaje TRL 1-3"].astype(float)
        df["Puntaje TRL 4-7"] = df["Puntaje TRL 4-7"].astype(float)
        df["Puntaje TRL 8-9"] = df["Puntaje TRL 8-9"].astype(float)
        df["Puntaje Total"] = df["Puntaje Total"].astype(float)

        # Calcular insights generales
        total_proyectos = int(len(df))
        aprobados = int((df["Aprobado"] == "Sí").sum())
        porcentaje_aprobados = round((aprobados / total_proyectos) * 100, 1) if total_proyectos > 0 else 0.0

        # Distribución por segmento TRL (convertimos claves y valores a tipos nativos)
        distribucion_trl_raw = df["Segmento TRL"].value_counts().to_dict()
        distribucion_trl = {str(k): int(v) for k, v in distribucion_trl_raw.items()}

        # Puntajes promedio
        promedios = {
            "TRL 1-3": round(df["Puntaje TRL 1-3"].mean(), 1),
            "TRL 4-7": round(df["Puntaje TRL 4-7"].mean(), 1),
            "TRL 8-9": round(df["Puntaje TRL 8-9"].mean(), 1),
            "Total": round(df["Puntaje Total"].mean(), 1)
        }

        # Proyectos destacados
        top_rows = df.nlargest(3, "Puntaje Total")[["Nombre del Proyecto", "Puntaje Total"]]
        top_proyectos = [
            {
                "Nombre del Proyecto": str(row["Nombre del Proyecto"]),
                "Puntaje Total": round(float(row["Puntaje Total"]), 1)
            }
            for _, row in top_rows.iterrows()
        ]

        # Insights cualitativos
        insights = [
            f"📊 {aprobados} de {total_proyectos} proyectos están aprobados ({porcentaje_aprobados:.1f}%)",
            f"🏆 Proyecto con mayor puntaje: {top_proyectos[0]['Nombre del Proyecto']} ({top_proyectos[0]['Puntaje Total']} pts)" if top_proyectos else "🏆 No hay proyectos destacados disponibles",
            f"🔍 Distribución TRL: {distribucion_trl.get('TRL 1-3', 0)} en etapa inicial, {distribucion_trl.get('TRL 4-7', 0)} en desarrollo, {distribucion_trl.get('TRL 8-9', 0)} cerca de implementación",
            f"📈 Puntajes promedio: TRL 1-3: {promedios['TRL 1-3']}, TRL 4-7: {promedios['TRL 4-7']}, TRL 8-9: {promedios['TRL 8-9']}",
            "💡 Recomendación general: " + (
                "Focalizar en mentoría para proyectos en TRL 1-3" if distribucion_trl.get('TRL 1-3', 0) > distribucion_trl.get('TRL 8-9', 0) 
                else "Preparar estrategias de implementación para proyectos maduros"
            )
        ]

        # Retornar usando jsonable_encoder para asegurar compatibilidad total
        return jsonable_encoder({
            "metricas": {
                "total_proyectos": total_proyectos,
                "aprobados": aprobados,
                "porcentaje_aprobados": porcentaje_aprobados,
                "distribucion_trl": distribucion_trl,
                "promedios": promedios
            },
            "top_proyectos": top_proyectos,
            "insights": insights
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar insights: {str(e)}")   
    
    