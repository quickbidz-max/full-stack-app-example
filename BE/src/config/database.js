const { DataSource } = require('typeorm');

// Define entities using plain JavaScript objects
const User = {
  name: 'User',
  tableName: 'user',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    name: {
      type: 'varchar',
      length: 255
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true
    },
    userName: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: true
    },
    password: {
      type: 'varchar',
      length: 255
    },
    dob: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    phone: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    address: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    city: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP'
    }
  }
};

const Product = {
  name: 'Product',
  tableName: 'product',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    product_name: {
      type: 'varchar',
      length: 255
    },
    description: {
      type: 'text'
    },
    price: {
      type: 'varchar',
      length: 255
    },
    quantity: {
      type: 'varchar',
      length: 255
    },
    category: {
      type: 'varchar',
      length: 255
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP'
    }
  }
};

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'test_db',
  entities: [User, Product],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
});

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('TypeORM DataSource has been initialized successfully.');
  } catch (error) {
    console.error('Error during DataSource initialization:', error);
    throw error;
  }
};

module.exports = { AppDataSource, initializeDatabase, User, Product };