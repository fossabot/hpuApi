FROM node:12.22.3
WORKDIR /home/hpuApi

LABEL MAINTAINER="hyun"

# Environment variables.
ENV NODE_ENV=production \
    PORT=9000

COPY . .

RUN sed -i "s@http://deb.debian.org@http://mirrors.aliyun.com@g" /etc/apt/sources.list && sed -i "s@http://security.debian.org@http://mirrors.aliyun.com@g" /etc/apt/sources.list
# Install common libraries
RUN apt-get update && apt-get --no-install-recommends install -y \
    cmake \
    libopencv-dev=2.4.9.1+dfsg1-2 \
    && rm -rf /var/lib/apt/lists/*

ARG nodep
RUN npm config set registry https://registry.npm.taobao.org
RUN if [[ -z "$nodep" ]] ; then npm install && npm cache clean --force ; else echo 跳过安装Node依赖 ; fi

EXPOSE 9000
CMD ["npm","run","serve"]