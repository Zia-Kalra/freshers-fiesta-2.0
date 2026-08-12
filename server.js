require('dotenv').config();

const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '8.8.4.4']);

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const port = Number(process.env.PORT || 3000);
const root = __dirname;

const databaseName = process.env.DATABASE_NAME || 'test';
const collectionName = process.env.COLLECTION_NAME || 'registrations';
const mongoUri = process.env.MONGODB_URI;

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

let registrations;

// Admin session storage
const sessions = new Map();
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

if (!mongoUri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

const mongoClient = new MongoClient(mongoUri);

async function connectDatabase() {
  await mongoClient.connect();

  registrations = mongoClient
    .db(databaseName)
    .collection(collectionName);

  await registrations.createIndex(
    { email: 1 },
    { unique: true }
  );

  await registrations.createIndex(
    { enrollment: 1 },
    { unique: true }
  );

  console.log(
    `MongoDB connected: ${databaseName}.${collectionName}`
  );
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;

      if (body.length > 10000) {
        reject(new Error('Request too large'));
      }
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

function validateRegistration(input) {
  const required = [
    'name',
    'email',
    'phone',
    'enrollment',
    'year',
    'course',
    'specialization'
  ];

  if (
    required.some(
      key => !input[key] || !String(input[key]).trim()
    )
  ) {
    return 'All registration fields are required.';
  }

  if (input.name.trim().length < 2) {
    return 'Full name must contain at least 2 characters.';
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email.trim())) {
    return 'Please provide a valid email address.';
  }
  
  if (!input.phone || input.phone.trim().length < 10) {
    return 'Please provide a valid Indian WhatsApp number.';
  }
  
  if (!input.confirmed) {
    return 'Please confirm that your information is correct.';
  }

  return null;
}

/* =========================================================
   ADMIN AUTHENTICATION
   ========================================================= */

function parseCookies(req) {
  const header = req.headers.cookie;

  if (!header) {
    return {};
  }

  return Object.fromEntries(
    header.split(';').map(cookie => {
      const [key, ...value] = cookie.trim().split('=');

      return [
        key,
        decodeURIComponent(value.join('='))
      ];
    })
  );
}

function createAdminSession() {
  const sessionId = crypto
    .randomBytes(32)
    .toString('hex');

  sessions.set(sessionId, {
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION
  });

  return sessionId;
}

function isAuthenticated(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies.admin_session;

  if (!sessionId) {
    return false;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return false;
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return false;
  }

  return true;
}

function getSessionId(req) {
  const cookies = parseCookies(req);
  return cookies.admin_session;
}

function setAdminCookie(res, sessionId) {
  const secure =
    process.env.NODE_ENV === 'production'
      ? '; Secure'
      : '';

  res.setHeader(
    'Set-Cookie',
    `admin_session=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_DURATION / 1000}${secure}`
  );
}

function clearAdminCookie(res) {
  res.setHeader(
    'Set-Cookie',
    'admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0'
  );
}

/* =========================================================
   API
   ========================================================= */

async function handleApi(req, res) {

  /* -----------------------------
     REGISTRATION
  ----------------------------- */

  if (
    req.method === 'POST' &&
    req.url === '/api/registrations'
  ) {
    try {
      const input = await readJson(req);

      const error = validateRegistration(input);

      if (error) {
        sendJson(res, 400, { error });
        return true;
      }

      const registration = {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        enrollment: input.enrollment.trim(),
        year: input.year.trim(),
        course: input.course.trim(),
        specialization: input.specialization.trim(),

        registrationId:
          `FF2.0-${Math.random()
            .toString(36)
            .slice(2, 10)
            .toUpperCase()}`,

        createdAt: new Date()
      };

      await registrations.insertOne(registration);

      sendJson(res, 201, {
        registration
      });

    } catch (error) {

      if (error.code === 11000) {
        sendJson(res, 409, {
          error:
            'This email or enrollment number is already registered.'
        });

        return true;
      }

      console.error(
        'Registration error:',
        error
      );

      sendJson(res, 500, {
        error:
          'Unable to save registration. Please try again.'
      });
    }

    return true;
  }

  /* -----------------------------
     ADMIN LOGIN
  ----------------------------- */

  if (
    req.method === 'POST' &&
    req.url === '/api/admin/login'
  ) {
    try {
      const input = await readJson(req);

      const username = String(
        input.username || ''
      );

      const password = String(
        input.password || ''
      );

      const validUsername =
        username === process.env.ADMIN_USERNAME;

      const validPassword =
        password === process.env.ADMIN_PASSWORD;

      if (!validUsername || !validPassword) {
        sendJson(res, 401, {
          error: 'Invalid username or password.'
        });

        return true;
      }

      const sessionId = createAdminSession();

      setAdminCookie(res, sessionId);

      sendJson(res, 200, {
        success: true
      });

    } catch (error) {

      console.error(
        'Admin login error:',
        error
      );

      sendJson(res, 400, {
        error: 'Invalid request.'
      });
    }

    return true;
  }

  /* -----------------------------
     CHECK ADMIN SESSION
  ----------------------------- */

  if (
    req.method === 'GET' &&
    req.url === '/api/admin/session'
  ) {
    sendJson(res, 200, {
      authenticated: isAuthenticated(req)
    });

    return true;
  }

  /* -----------------------------
     GET ALL REGISTRATIONS
  ----------------------------- */

  if (
    req.method === 'GET' &&
    req.url === '/api/admin/registrations'
  ) {

    if (!isAuthenticated(req)) {
      sendJson(res, 401, {
        error: 'Unauthorized'
      });

      return true;
    }

    try {

      const data = await registrations
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      sendJson(res, 200, {
        registrations: data,
        count: data.length
      });

    } catch (error) {

      console.error(
        'Admin registrations error:',
        error
      );

      sendJson(res, 500, {
        error:
          'Unable to fetch registrations.'
      });
    }

    return true;
  }

  /* -----------------------------
     ADMIN LOGOUT
  ----------------------------- */

  if (
    req.method === 'POST' &&
    req.url === '/api/admin/logout'
  ) {

    const sessionId = getSessionId(req);

    if (sessionId) {
      sessions.delete(sessionId);
    }

    clearAdminCookie(res);

    sendJson(res, 200, {
      success: true
    });

    return true;
  }

  return false;
}

/* =========================================================
   STATIC FILE SERVER
   ========================================================= */

function serveStatic(req, res) {

  const requested =
    decodeURIComponent(
      req.url.split('?')[0]
    );

  /* Special admin page */

  if (requested === '/admin') {

    const adminFile =
      path.join(root, 'admin.html');

    fs.readFile(
      adminFile,
      (error, content) => {

        if (error) {
          res.writeHead(404);
          res.end('Admin portal not found.');
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/html'
        });

        res.end(content);
      }
    );

    return;
  }

  const relative =
    requested === '/'
      ? '/index.html'
      : requested;

  const file =
    path.resolve(
      root,
      `.${relative}`
    );

  /* Prevent directory traversal */

  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(
    file,
    (error, content) => {

      if (error) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      res.writeHead(200, {
        'Content-Type':
          mime[path.extname(file)] ||
          'application/octet-stream'
      });

      res.end(content);
    }
  );
}

/* =========================================================
   SERVER
   ========================================================= */

async function start() {

  await connectDatabase();

  http.createServer(
    async (req, res) => {

      if (
        await handleApi(req, res)
      ) {
        return;
      }

      serveStatic(req, res);
    }

  ).listen(
    port,
    () => {
      console.log(
        `Fresher's Fiesta is running at http://localhost:${port}`
      );
    }
  );
}

start().catch(
  error => {
    console.error(
      'Startup error:',
      error.message
    );

    process.exit(1);
  }
);