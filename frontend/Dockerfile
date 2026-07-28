# Serve the pre-built React app with Nginx
# Run "npm run build" locally before building this image.
FROM nginx:alpine

# Clean default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the pre-built production bundle
COPY dist/ /usr/share/nginx/html/

# Nginx config for SPA routing (React Router)
RUN sed -i 's/index  index.html index.htm;/index  index.html index.htm;\'$'\n        try_files $uri $uri\/ \/index.html;/g' /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]