FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install --prefer-offline --no-audit --progress=false
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
