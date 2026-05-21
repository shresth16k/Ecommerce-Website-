import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'db', 'shopora.db');

// Ensure db directory exists
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Check if database file exists before opening it
const dbExists = fs.existsSync(DB_PATH);

// Open database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to Shopora SQLite database.');
    if (!dbExists) {
      initializeDatabase();
    }
  }
});

function initializeDatabase() {
  console.log('Initializing database with schema and seed data...');
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf-8');
    const seed = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf-8');

    db.serialize(() => {
      // Split and run commands to ensure they run correctly
      db.exec(schema, (err) => {
        if (err) {
          console.error('Error applying schema:', err.message);
        } else {
          console.log('Schema applied successfully.');
          
          db.exec(seed, (err) => {
            if (err) {
              console.error('Error seeding database:', err.message);
            } else {
              console.log('Database seeded successfully.');
            }
          });
        }
      });
    });
  } catch (err) {
    console.error('Failed to read schema/seed files:', err.message);
  }
}

// Promisified query methods that capture execution speed
export const query = {
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      db.all(sql, params, (err, rows) => {
        const duration = performance.now() - start;
        if (err) {
          reject(err);
        } else {
          resolve({ rows, duration: parseFloat(duration.toFixed(2)) });
        }
      });
    });
  },
  
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      db.get(sql, params, (err, row) => {
        const duration = performance.now() - start;
        if (err) {
          reject(err);
        } else {
          resolve({ row, duration: parseFloat(duration.toFixed(2)) });
        }
      });
    });
  },
  
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      db.run(sql, params, function (err) {
        const duration = performance.now() - start;
        if (err) {
          reject(err);
        } else {
          resolve({ 
            id: this.lastID, 
            changes: this.changes, 
            duration: parseFloat(duration.toFixed(2)) 
          });
        }
      });
    });
  },
  
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      db.exec(sql, (err) => {
        const duration = performance.now() - start;
        if (err) {
          reject(err);
        } else {
          resolve({ duration: parseFloat(duration.toFixed(2)) });
        }
      });
    });
  }
};

export default db;
