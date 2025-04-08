# Imagen base
FROM node:22-alpine

WORKDIR /app

COPY . .

# Instalar dependencias
RUN npm install --prefer-offline --legacy-peer-deps

# Puerto para desarrollo
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
