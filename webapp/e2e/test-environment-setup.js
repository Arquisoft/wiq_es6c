const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('./user-model')
const bcrypt = require('bcrypt');

let mongoserver;
let userservice;
let authservice;
let gatewayservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');

    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;

    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    gameservice = await require("../../gameservice/game-service");

    process.env.MONGODB_URI = mongoUri;

    await mongoose.connect(mongoUri)

    try {
      const hashedPassword = await bcrypt.hash('CuevaRector2024', 10);
      const user = new User({
        username: 'AlbertoQL',
        password: hashedPassword
      });
      await user.save();
      console.log('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  }

  startServer();
