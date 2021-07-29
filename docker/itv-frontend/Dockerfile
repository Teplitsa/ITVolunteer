FROM node:carbon

WORKDIR /site/tep-itv/frontend/
RUN npm install -g n
RUN n 12.16.3
RUN npm install
ENV PATH /site/tep-itv/frontend/node_modules/.bin:$PATH
