# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/questionsservice/wikidataExtractor

# Copy package.json and package-lock.json to the working directory
COPY ./wikidataExtractor/package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY ./wikidataExtractor/ .
COPY questiondata-model.js .

# Expose the port the app runs on
EXPOSE 8008

# Define the command to run your app
CMD ["node", "wikidataextractor-service.js"]
