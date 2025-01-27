// middleware/auth.js
const { ClerkExpressRequireAuth } = require('@clerk/express');

const authenticate = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY // Explicitly pass the key
});

module.exports = authenticate;