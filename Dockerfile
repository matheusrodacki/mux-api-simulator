# Use a imagem oficial do Node.js 18
FROM node:18-alpine

# Cria o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o código fonte
COPY src ./src

# Compila o TypeScript
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Define as variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"] 