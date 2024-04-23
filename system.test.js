import { test, expect } from 'vitest';
const supertest = require('supertest');
const app = require('./system'); // Assuming your Express app is exported from system.js

const system = supertest(app); // Create a supertest instance of your Express app

const assert = require('assert'); // Not required for this test

test('Login with unregistered user', async () => {
  const unregisteredEmail = 'nonexistent@example.com';
  const password = 'anypassword';

  const response = await system.post('/login')
    .send({ email: unregisteredEmail, password });

  expect(response.status).toBe(200);
  expect(response.body).toEqual(expect.objectContaining({
    code: -1,
    "data": null,
    msg: 'Email is not exist',
  }));

  
});