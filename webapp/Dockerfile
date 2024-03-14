FROM node:20

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install

ARG API_URI="http://localhost:8000"
ENV REACT_APP_API_ENDPOINT=$API_URI

ARG QUESTIONS_API="http://localhost:8007"
ENV CONNECTION_WITH_QUESTIONS_API=$QUESTIONS_API

#Create an optimized version of the webapp
RUN npm run build
RUN npm install serve

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]