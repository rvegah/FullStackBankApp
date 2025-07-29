# Dockerfile para React
FROM node:18-alpine

# Crear directorio de la app
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de React
EXPOSE 3000

# Ejecutar React en modo desarrollo
CMD ["npm", "start"]
