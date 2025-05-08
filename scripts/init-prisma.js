/* eslint-disable no-console */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Initializing Prisma client...');

// Ensure prisma directory exists
const prismaDir = path.join(__dirname, '../prisma');
if (!fs.existsSync(prismaDir)) {
  console.log('Prisma directory not found, copying from db directory...');
  try {
    // Determine database type from env or default to postgresql
    const databaseType = process.env.DATABASE_TYPE || 'postgresql';
    const srcDir = path.join(__dirname, `../db/${databaseType}`);

    // Copy files
    fs.mkdirSync(prismaDir, { recursive: true });
    fs.readdirSync(srcDir).forEach(file => {
      fs.copyFileSync(path.join(srcDir, file), path.join(prismaDir, file));
    });
    console.log(`Copied from ${srcDir} to ${prismaDir}`);
  } catch (err) {
    console.error('Error copying prisma files:', err);
    process.exit(1);
  }
}

// Generate Prisma client
try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully.');
} catch (err) {
  console.error('Error generating Prisma client:', err);
  process.exit(1);
}