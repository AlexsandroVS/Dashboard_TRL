// src/utils/displayMetrics.ts
import React from 'react';

export const displayMetrics = (metricas: any) => {
  return (
    <div className="metrics-list">
      <p>Total proyectos: {metricas.totalProyectos}</p>
      <p>Proyectos aprobados: {metricas.proyectosAprobados}</p>
      <p>Proyectos con docente: {metricas.proyectosConDocente}</p>
    </div>
  );
};
