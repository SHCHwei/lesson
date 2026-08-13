# 開發環境 Dockerfile
# 使用 docker-compose.yml 搭配此檔案進行本地開發
FROM node:20-alpine

WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有原始碼（開發時會被 volume 掛載覆蓋）
COPY . .

# 暴露 Vite 開發服務器端口
EXPOSE 5173

# 啟動開發服務器
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
