// MongoDB configuration and connection utilities
// This is a placeholder for MongoDB integration

export interface DatabaseConfig {
  connectionString: string;
  databaseName: string;
  collections: {
    users: string;
    appointments: string;
    services: string;
    managers: string;
    tickets: string;
    payments: string;
    notifications: string;
  };
}

export const dbConfig: DatabaseConfig = {
  connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017/appointpro',
  databaseName: 'appointpro',
  collections: {
    users: 'users',
    appointments: 'appointments',
    services: 'services',
    managers: 'managers',
    tickets: 'support_tickets',
    payments: 'payments',
    notifications: 'notifications'
  }
};

// User interface for MongoDB documents
export interface User {
  _id?: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'user';
  password: string;
  phone?: string;
  addresses?: Address[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Address {
  _id?: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Appointment {
  _id?: string;
  userId: string;
  serviceId: string;
  managerId?: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  location: string;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  _id?: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  availableLocations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportTicket {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string; // manager/admin id
  createdAt: Date;
  updatedAt: Date;
  responses: TicketResponse[];
}

export interface TicketResponse {
  _id?: string;
  userId: string;
  message: string;
  isStaff: boolean;
  createdAt: Date;
}

export interface Payment {
  _id?: string;
  appointmentId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'ziina' | 'cash' | 'card';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Database connection utility (placeholder)
export class MongoDBClient {
  private static instance: MongoDBClient;
  private connected: boolean = false;

  private constructor() {}

  public static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }
    return MongoDBClient.instance;
  }

  public async connect(): Promise<void> {
    // TODO: Implement actual MongoDB connection
    console.log('Connecting to MongoDB...');
    this.connected = true;
  }

  public async disconnect(): Promise<void> {
    // TODO: Implement actual MongoDB disconnection
    console.log('Disconnecting from MongoDB...');
    this.connected = false;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  // CRUD operations placeholders
  public async findOne(collection: string, query: any): Promise<any> {
    // TODO: Implement MongoDB findOne
    console.log(`Finding one document in ${collection}:`, query);
    return null;
  }

  public async find(collection: string, query: any = {}): Promise<any[]> {
    // TODO: Implement MongoDB find
    console.log(`Finding documents in ${collection}:`, query);
    return [];
  }

  public async insertOne(collection: string, document: any): Promise<any> {
    // TODO: Implement MongoDB insertOne
    console.log(`Inserting document into ${collection}:`, document);
    return { insertedId: 'mock-id' };
  }

  public async updateOne(collection: string, query: any, update: any): Promise<any> {
    // TODO: Implement MongoDB updateOne
    console.log(`Updating document in ${collection}:`, query, update);
    return { modifiedCount: 1 };
  }

  public async deleteOne(collection: string, query: any): Promise<any> {
    // TODO: Implement MongoDB deleteOne
    console.log(`Deleting document from ${collection}:`, query);
    return { deletedCount: 1 };
  }
}

export const db = MongoDBClient.getInstance();