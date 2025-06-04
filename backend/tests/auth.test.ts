import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';
import User from '../src/models/User';
import { beforeAll, afterAll, describe, test, expect } from '@jest/globals';

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/bizmall_test');
});

afterAll(async () => {
  // Clear test data and close connection
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Authentication', () => {
  let token: string;
  
  test('Should login a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        userId: 'testuser',
        walletAddress: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });
  
  test('Should get user profile with valid token', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId', 'testuser');
  });
  
  test('Should reject unauthorized access', async () => {
    const response = await request(app)
      .get('/api/auth/profile');
    
    expect(response.status).toBe(401);
  });
});