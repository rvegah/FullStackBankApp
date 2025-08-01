# bank-angular-app/Dockerfile

FROM node:18

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto 4200 (puerto por defecto de Angular)
EXPOSE 4200

# Comando para iniciar la aplicación en modo desarrollo
# Usamos ng directamente ya que está instalado localmente
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]