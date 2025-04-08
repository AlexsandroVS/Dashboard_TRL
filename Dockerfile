# Usar una imagen base oficial de Python
FROM python:3.10-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de requisitos y el código fuente
COPY requirements.txt .
COPY . .

# Instalar las dependencias
RUN pip install --default-timeout=100 --no-cache-dir -r requirements.txt

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 8000

# Comando por defecto para ejecutar la aplicación
CMD ["uvicorn", "backend_api:app", "--host", "0.0.0.0", "--port", "8000"]
