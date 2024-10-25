const { Pool } = require('pg');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
    this.connected = false;
  }

  async initialize() {
    if (this.pool) {
      return this.pool;
    }

    const poolConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "development" 
        ? { rejectUnauthorized: false }
        : process.env.DATABASE_SSL 
          ? { rejectUnauthorized: true }
          : false,
      // Connection pool settings
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
    };

    try {
      this.pool = new Pool(poolConfig);

      // Test the connection
      const client = await this.pool.connect();
      console.log('Successfully connected to PostgreSQL database');
      client.release();
      this.connected = true;

      // Handle pool errors
      this.pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err);
      });

      return this.pool;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  }

  async query(text, params) {
    if (!this.connected) {
      await this.initialize();
    }

    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;

      if (process.env.NODE_ENV === "development") {
        console.log('Executed query', {
          text,
          duration,
          rows: res.rowCount,
        });
      }

      return res;
    } catch (error) {
      const duration = Date.now() - start;
      console.error('Database query error', {
        text,
        duration,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.connected = false;
      console.log('Database connection pool closed');
    }
  }

  // Health check method
  async healthCheck() {
    try {
      await this.query('SELECT NOW()');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Create and export a single instance
const db = new Database();

module.exports = db;