import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8000';

export const getGraficosData = async (password: string) => {
    try {
        const response = await axios.get(`${apiUrl}/datos-graficos`, {
            headers: {
                Authorization: `Basic ${btoa(`multimediafalab:${password}`)}`
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo gráficos:", error);
        throw error;
    }
};

export const descargarReporteAprobados = async (password: string): Promise<void> => {
    const user = "multimediafalab";
    const encodedCreds = btoa(`${user}:${password}`);
    const url = `http://localhost:8000/reporte-aprobados?auth=${encodedCreds}`;
  
    const win = window.open(url, "_blank");
    if (win) {
      win.focus();
    } else {
      alert("Permite las ventanas emergentes para ver el reporte.");
    }
  };
  

export const getMetricasPrincipales = async (password: string) => {
    try {
        const response = await axios.get(`${apiUrl}/metricas-principales`, {
            headers: {
                Authorization: `Basic ${btoa(`multimediafalab:${password}`)}`
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo métricas:", error);
        throw error;
    }
};

// 🛠️ **Corrección en `actualizarDatos`**
export const actualizarDatos = async (password: string) => {
    try {
        const headers = {
            Authorization: `Basic ${btoa(`multimediafalab:${password}`)}`
        };

        const response = await axios.post(`${apiUrl}/actualizar-datos`, {}, { headers }); // 🔹 No enviar password en el body
        return response.data;
    } catch (error) {
        console.error("Error al actualizar los datos:", error);
        throw error;
    }
};

export const buscarProyecto = async (nombre: string, password: string) => {
    try {
        const response = await axios.post(`${apiUrl}/buscar-proyecto`, 
            { nombre }, // Enviar el nombre en el body (POST)
            {
                headers: {
                    Authorization: `Basic ${btoa(`multimediafalab:${password}`)}`
                },
            }
        );
        return response.data.proyectos; // Acceder a la propiedad 'proyectos'
    } catch (error) {
        console.error('Error al buscar el proyecto:', error);
        return []; // Devolver array vacío en caso de error
    }
};
export const obtenerProyectos = async (password: string) => {
    try {
        const response = await axios.get(`${apiUrl}/proyectos`, {
            headers: {
                Authorization: `Basic ${btoa(`multimediafalab:${password}`)}`

            },
        });
        return response.data.proyectos; // Acceder a la propiedad 'proyectos'
    } catch (error) {
        console.error("Error obteniendo proyectos:", error);
        throw error;
    }
};

export const generarReporteProyecto = async (nombre: string, password: string) => {
    try {
      const user = "multimediafalab";
      const encodedCreds = btoa(`${user}:${password}`);
      const url = `${apiUrl}/reporte-proyecto/${encodeURIComponent(nombre)}`;
  
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${encodedCreds}`,
        },
        responseType: 'blob',
      });
  
      // Abrir el PDF en una nueva ventana
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
  
      return response.data;
    } catch (error) {
      console.error('Error generando reporte del proyecto:', error);
      throw error;
    }
  };
  

// Agregar esta nueva función
export const getInsightsGenerales = async (password: string) => {
    try {
        const response = await axios.get(`${apiUrl}/insights-generales`, {
            headers: {
                Authorization: `Basic ${btoa(`multimediafalab:${password}`)}`
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo insights generales:", error);
        throw error;
    }
};

export const descargarReporteTop10 = async (password: string): Promise<void> => {
    const auth = btoa(`usuario:${password}`); 
    const url = `http://localhost:8000/reporte-top10?auth=${auth}`;
    const win = window.open(url, "_blank");
    if (win) win.focus();
    else alert("Permite las ventanas emergentes para ver el reporte.");
  };
  