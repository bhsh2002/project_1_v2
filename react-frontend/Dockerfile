# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# نسخ package.json و package-lock.json فقط لتثبيت الاعتمادات
COPY package*.json ./

RUN npm install

# نسخ كل الملفات وبناء المشروع
COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

# نسخ ملفات البناء إلى مجلد nginx
COPY --from=build /app/dist /usr/share/nginx/html

# # نسخ إعدادات nginx مخصصة (اختياري)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
