FROM node:24-alpine
WORKDIR /spec
RUN npm install -g @redocly/cli@latest @stoplight/spectral-cli@latest
EXPOSE 4000 4001
CMD redocly preview --product redoc --port 4000 -d v1 & \
  # redocly preview --product redoc --port 4001 -d v2 & \
  wait
