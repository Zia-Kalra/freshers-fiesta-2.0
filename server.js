require('dotenv').config();

const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '8.8.4.4']);

const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const port = Number(process.env.PORT || 3000);
const root = __dirname;
const databaseName = process.env.DATABASE_NAME || 'test';
const collectionName = process.env.COLLECTION_NAME || 'registrations';
const mongoUri = process.env.MONGODB_URI;
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
let registrations;

if (!mongoUri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

const mongoClient = new MongoClient(mongoUri);

async function connectDatabase() {
  await mongoClient.connect();
  registrations = mongoClient.db(databaseName).collection(collectionName);
  await registrations.createIndex({ enrollment: 1 }, { unique: true });
  await registrations.createIndex({ email: 1 }, { unique: true });
  console.log(`MongoDB connected: ${databaseName}.${collectionName}`);
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10000) reject(new Error('Request too large'));
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function validateRegistration(input) {
  const required = ['name', 'email', 'phone', 'enrollment', 'year', 'course', 'specialization'];
  if (required.some(key => typeof input[key] !== 'string' || !input[key].trim())) return 'All registration fields are required.';
  if (input.name.trim().length < 2) return 'Full name must contain at least 2 characters.';
  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) return 'Please provide a valid email address.';
  if (!/^\+91\s?[6-9]\d{9}$/.test(input.phone.trim())) return 'Please provide a valid Indian WhatsApp number.';
  if (!input.confirmed) return 'Please confirm that your information is correct.';
  return null;
}

async function handleApi(req, res) {
  if (req.method !== 'POST' || req.url !== '/api/registrations') return false;
  try {
    const input = await readJson(req);
    const error = validateRegistration(input);
    if (error) { sendJson(res, 400, { error }); return true; }
    const registration = {
      name: input.name.trim(), email: input.email.trim().toLowerCase(), phone: input.phone.trim(),
      enrollment: input.enrollment.trim(), year: input.year.trim(), course: input.course.trim(),
      specialization: input.specialization.trim(), registrationId: `FF2.0-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date()
    };
    await registrations.insertOne(registration);
    sendJson(res, 201, { registration });
  } catch (error) {
    if (error?.code === 11000) { sendJson(res, 409, { error: 'This email or enrollment number is already registered.' }); return true; }
    console.error('Registration error:', error.message);
    sendJson(res, 500, { error: 'Unable to save registration. Please try again.' });
  }
  return true;
}

function serveStatic(req, res) {
  const requested = decodeURIComponent(req.url.split('?')[0]);
  const relative = requested === '/' ? '/index.html' : requested;
  const file = path.resolve(root, `.${relative}`);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (error, content) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(content);
  });
}

async function start() {
  await connectDatabase();
  http.createServer(async (req, res) => {
    if (await handleApi(req, res)) return;
    serveStatic(req, res);
  }).listen(port, () => console.log(`Fresher's Fiesta is running at http://localhost:${port}`));
}

start().catch(error => { console.error('Startup error:', error.message); process.exit(1); });
