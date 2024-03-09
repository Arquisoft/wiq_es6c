FROM node:20

COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install

ENV REACT_APP_API_ENDPOINT="http://localhost:8000"

#Create an optimized version of the webapp
RUN npm run build
RUN npm install serve

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]