FROM registry.gitlab.com/obsessvr/ci-scripts/frontend_build_base_1.1.0:latest as base

COPY package.json package.json

RUN npm ci

COPY . .

ARG BUILD_ENV=production
ARG MODULE_PATH

RUN npm run build-ci

FROM alpine:3.7

# create the dist folder and copy the www contents over from the final image
RUN mkdir /dist && \
    chmod -R 755 /dist

COPY --from=0 /dist /dist

ENTRYPOINT ["tail", "-f", "/dev/null"]
