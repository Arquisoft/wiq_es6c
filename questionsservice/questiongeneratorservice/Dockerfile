# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/questionsservice/questiongeneratorservice

# Copy package.json and package-lock.json to the working directory
COPY ./questiongeneratorservice/package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code to the working directory
COPY ./questiongeneratorservice/ .
COPY questiondata-model.js .

# Expose the port the app runs on
EXPOSE 8007

# Define the command to run your app
CMD ["node", "questiongenerator-service.js"]
