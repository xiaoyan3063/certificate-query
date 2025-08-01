# 简化的Dockerfile - 只用于部署预构建的静态文件
FROM nginx:stable-alpine
# 复制本地构建的dist目录到Nginx目录
COPY dist /usr/share/nginx/html
# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
