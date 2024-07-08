# Usar una imagen oficial de Node como imagen base
FROM node:18 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto predeterminado de Angular
EXPOSE 4200

# Iniciar la aplicación Angular en modo desarrollo
CMD ["npm", "start"]
