require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const connectDb = require('../db');
const Admin = require('../models/Admin');
const { Content, SECTIONS } = require('../models/Content');
const INITIAL_CONTENT = require('./initialContent');

async function seed() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before seeding');
  }

  await connectDb();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await Admin.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { email: ADMIN_EMAIL.toLowerCase(), passwordHash },
    { upsert: true }
  );
  console.log(`Admin user ready: ${ADMIN_EMAIL}`);

  for (const section of SECTIONS) {
    const existing = await Content.findOne({ section });
    if (existing) {
      console.log(`Content "${section}" already exists, leaving it alone`);
      continue;
    }
    const value = INITIAL_CONTENT[section];
    await Content.create({ section, draft: value, live: value });
    console.log(`Seeded content "${section}"`);
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
