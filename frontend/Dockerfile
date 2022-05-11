# Stage 1 - the build process
FROM node:lts as build-deps
WORKDIR /usr/src/app
ENV PUBLIC_URL /frontend/
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Stage 2 - Nginx
FROM steebchen/nginx-spa:stable
ENV PUBLIC_URL /frontend/
COPY --from=build-deps /usr/src/app/build /app
EXPOSE 80
CMD ["nginx"]