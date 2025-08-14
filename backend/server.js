const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { sendOTP, verifyOTP } = require('./services/otpService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'appointpro-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Create a connection pool without specifying a database initially
const rootPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Database name
const dbName = process.env.DB_NAME || 'appointpro';

// Initialize database and tables
async function initializeDatabase() {
  try {
    // Create a connection without prepared statements for DDL commands
    const connection = await rootPool.getConnection();
    
    // Create database if not exists - using query instead of execute
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    // Release the initial connection
    connection.release();
    
    // Create a new pool that's already connected to the database
    const dbPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Get a connection from the new pool
    const dbConnection = await dbPool.getConnection();
    
    // Create users table if not exists
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        fullName VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        address JSON NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'manager', 'admin', 'super_admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create appointments table if not exists
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service VARCHAR(100) NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status ENUM('pending', 'confirmed', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
        location JSON NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create user_addresses table if not exists
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        address_type VARCHAR(50) NOT NULL,
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'United States',
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create support_tickets table if not exists
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database and tables initialized successfully');
    dbConnection.release();
    
    // Return the configured pool for the application to use
    return dbPool;
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1); // Exit if database initialization fails
  }
}

// Create a connection pool for the application after database is initialized
let pool;

// API Routes

// Send OTP to phone number
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // Send OTP using Twilio
    const result = await sendOTP(phone);
    
    if (result.success) {
      // Include test OTP in response for development mode
      const response = { 
        message: result.message,
        success: true
      };
      
      // Add test info for development
      if (result.testMode) {
        response.testMode = true;
        response.testOtp = result.testOtp;
      }
      
      return res.json(response);
    } else {
      return res.status(500).json({ 
        message: result.message,
        success: false
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP and login/register
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }
    
    // Verify OTP
    const otpResult = verifyOTP(phone, otp);
    
    if (!otpResult.success) {
      return res.status(400).json({ 
        message: otpResult.message,
        success: false
      });
    }
    
    // Check if user exists
    const [userRows] = await pool.execute('SELECT * FROM users WHERE phone = ?', [phone]);
    
    if (userRows.length > 0) {
      // User exists - login
      const user = userRows[0];
      
      // Generate JWT token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      // Remove password from user object
      delete user.password;
      
      return res.json({
        message: 'Login successful',
        token,
        user,
        isNewUser: false
      });
    } else {
      // User doesn't exist - return flag for registration
      return res.json({
        message: 'Phone verified, please complete registration',
        phone,
        isNewUser: true,
        success: true
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Check if phone number exists
app.post('/api/auth/check-phone', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    const [rows] = await pool.execute('SELECT id FROM users WHERE phone = ?', [phone]);
    
    return res.json({ exists: rows.length > 0 });
  } catch (error) {
    console.error('Error checking phone:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Register new user (modified for OTP flow)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { phone, fullName, email, address, password, isOtpVerified } = req.body;
    
    // Validate input
    if (!phone || !fullName || !email || !address) {
      return res.status(400).json({ message: 'Phone, name, email, and address are required' });
    }
    
    // For OTP flow, password is optional (can be set later)
    if (!isOtpVerified && !password) {
      return res.status(400).json({ message: 'Password is required for non-OTP registration' });
    }
    
    // Check if phone already exists
    const [phoneCheck] = await pool.execute('SELECT id FROM users WHERE phone = ?', [phone]);
    if (phoneCheck.length > 0) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
    
    // Check if email already exists
    const [emailCheck] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password if provided, otherwise use a placeholder
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      // For OTP users, create a placeholder password that they'll need to change
      hashedPassword = await bcrypt.hash(phone + '_temp_otp_password', 10);
    }
    
    // Convert address object to JSON string for storage
    const addressJSON = JSON.stringify(address);
    
    // Insert new user
    const [result] = await pool.execute(
      'INSERT INTO users (phone, fullName, email, address, password) VALUES (?, ?, ?, ?, ?)',
      [phone, fullName, email, addressJSON, hashedPassword]
    );
    
    // Generate JWT token
    const user = {
      id: result.insertId,
      phone,
      fullName,
      email
    };
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    return res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Validate input
    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }
    
    // Find user by phone
    const [rows] = await pool.execute('SELECT * FROM users WHERE phone = ?', [phone]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = rows[0];
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Remove password from user object
    delete user.password;
    
    return res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// User Profile API
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, phone, fullName, email, address, role FROM users WHERE id = ?', [req.user.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    
    // Validate input
    if (!fullName && !email && !phone) {
      return res.status(400).json({ message: 'At least one field is required' });
    }
    
    // Build the update query dynamically based on provided fields
    let updateQuery = 'UPDATE users SET ';
    const updateValues = [];
    
    if (fullName) {
      updateQuery += 'fullName = ?, ';
      updateValues.push(fullName);
    }
    
    if (email) {
      updateQuery += 'email = ?, ';
      updateValues.push(email);
    }
    
    if (phone) {
      updateQuery += 'phone = ?, ';
      updateValues.push(phone);
    }
    
    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    
    // Add WHERE clause
    updateQuery += ' WHERE id = ?';
    updateValues.push(req.user.id);
    
    // Execute the update
    await pool.execute(updateQuery, updateValues);
    
    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// User Appointments API

// Get all appointments for the user
app.get('/api/user/appointments', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM appointments WHERE user_id = ? ORDER BY appointment_date DESC, appointment_time DESC`,
      [req.user.id]
    );
    
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get upcoming appointments for the user
app.get('/api/user/appointments/upcoming', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM appointments 
       WHERE user_id = ? AND 
       (appointment_date > CURDATE() OR 
        (appointment_date = CURDATE() AND appointment_time >= CURTIME())) AND
       status NOT IN ('completed', 'cancelled')
       ORDER BY appointment_date ASC, appointment_time ASC`,
      [req.user.id]
    );
    
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get past appointments for the user
app.get('/api/user/appointments/past', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM appointments 
       WHERE user_id = ? AND 
       (appointment_date < CURDATE() OR 
        (appointment_date = CURDATE() AND appointment_time < CURTIME()) OR
        status = 'completed')
       ORDER BY appointment_date DESC, appointment_time DESC`,
      [req.user.id]
    );
    
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching past appointments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create a new appointment
app.post('/api/user/appointments', authenticateToken, async (req, res) => {
  try {
    const { service, appointment_date, appointment_time, location, price, notes } = req.body;
    
    // Validate input
    if (!service || !appointment_date || !appointment_time || !location || !price) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Convert location object to JSON string
    const locationJSON = JSON.stringify(location);
    
    // Insert new appointment
    const [result] = await pool.execute(
      `INSERT INTO appointments 
       (user_id, service, appointment_date, appointment_time, location, price, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, service, appointment_date, appointment_time, locationJSON, price, notes || null]
    );
    
    return res.status(201).json({ 
      message: 'Appointment created successfully',
      appointment_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status (cancel, reschedule)
app.put('/api/user/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, appointment_date, appointment_time } = req.body;
    
    // Verify the appointment belongs to the user
    const [appointmentCheck] = await pool.execute(
      'SELECT id FROM appointments WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (appointmentCheck.length === 0) {
      return res.status(404).json({ message: 'Appointment not found or not authorized' });
    }
    
    // Build the update query dynamically based on provided fields
    let updateQuery = 'UPDATE appointments SET ';
    const updateValues = [];
    
    if (status) {
      updateQuery += 'status = ?, ';
      updateValues.push(status);
    }
    
    if (appointment_date) {
      updateQuery += 'appointment_date = ?, ';
      updateValues.push(appointment_date);
    }
    
    if (appointment_time) {
      updateQuery += 'appointment_time = ?, ';
      updateValues.push(appointment_time);
    }
    
    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    
    // Add WHERE clause
    updateQuery += ' WHERE id = ? AND user_id = ?';
    updateValues.push(id, req.user.id);
    
    // Execute the update
    await pool.execute(updateQuery, updateValues);
    
    return res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// User Addresses API

// Get all addresses for the user
app.get('/api/user/addresses', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add a new address
app.post('/api/user/addresses', authenticateToken, async (req, res) => {
  try {
    const { 
      address_type, 
      address_line1, 
      address_line2, 
      city, 
      state, 
      postal_code, 
      country, 
      is_default 
    } = req.body;
    
    // Validate input
    if (!address_type || !address_line1 || !city || !state || !postal_code) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // If this is set as default, unset any existing default address
    if (is_default) {
      await pool.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?',
        [req.user.id]
      );
    }
    
    // Insert new address
    const [result] = await pool.execute(
      `INSERT INTO user_addresses 
       (user_id, address_type, address_line1, address_line2, city, state, postal_code, country, is_default) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, 
        address_type, 
        address_line1, 
        address_line2 || null, 
        city, 
        state, 
        postal_code, 
        country || 'United States', 
        is_default || false
      ]
    );
    
    return res.status(201).json({ 
      message: 'Address added successfully',
      address_id: result.insertId
    });
  } catch (error) {
    console.error('Error adding address:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update an address
app.put('/api/user/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      address_type, 
      address_line1, 
      address_line2, 
      city, 
      state, 
      postal_code, 
      country, 
      is_default 
    } = req.body;
    
    // Verify the address belongs to the user
    const [addressCheck] = await pool.execute(
      'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (addressCheck.length === 0) {
      return res.status(404).json({ message: 'Address not found or not authorized' });
    }
    
    // If this is set as default, unset any existing default address
    if (is_default) {
      await pool.execute(
        'UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
        [req.user.id, id]
      );
    }
    
    // Build the update query dynamically based on provided fields
    let updateQuery = 'UPDATE user_addresses SET ';
    const updateValues = [];
    
    if (address_type) {
      updateQuery += 'address_type = ?, ';
      updateValues.push(address_type);
    }
    
    if (address_line1) {
      updateQuery += 'address_line1 = ?, ';
      updateValues.push(address_line1);
    }
    
    if (address_line2 !== undefined) {
      updateQuery += 'address_line2 = ?, ';
      updateValues.push(address_line2);
    }
    
    if (city) {
      updateQuery += 'city = ?, ';
      updateValues.push(city);
    }
    
    if (state) {
      updateQuery += 'state = ?, ';
      updateValues.push(state);
    }
    
    if (postal_code) {
      updateQuery += 'postal_code = ?, ';
      updateValues.push(postal_code);
    }
    
    if (country) {
      updateQuery += 'country = ?, ';
      updateValues.push(country);
    }
    
    if (is_default !== undefined) {
      updateQuery += 'is_default = ?, ';
      updateValues.push(is_default);
    }
    
    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    
    // Add WHERE clause
    updateQuery += ' WHERE id = ? AND user_id = ?';
    updateValues.push(id, req.user.id);
    
    // Execute the update
    await pool.execute(updateQuery, updateValues);
    
    return res.json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete an address
app.delete('/api/user/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify the address belongs to the user
    const [addressCheck] = await pool.execute(
      'SELECT id, is_default FROM user_addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    if (addressCheck.length === 0) {
      return res.status(404).json({ message: 'Address not found or not authorized' });
    }
    
    // Delete the address
    await pool.execute(
      'DELETE FROM user_addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    // If this was the default address, set another address as default if available
    if (addressCheck[0].is_default) {
      const [remainingAddresses] = await pool.execute(
        'SELECT id FROM user_addresses WHERE user_id = ? LIMIT 1',
        [req.user.id]
      );
      
      if (remainingAddresses.length > 0) {
        await pool.execute(
          'UPDATE user_addresses SET is_default = TRUE WHERE id = ?',
          [remainingAddresses[0].id]
        );
      }
    }
    
    return res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Support Tickets API

// Get all support tickets for the user
app.get('/api/user/support-tickets', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create a new support ticket
app.post('/api/user/support-tickets', authenticateToken, async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    // Validate input
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }
    
    // Insert new support ticket
    const [result] = await pool.execute(
      'INSERT INTO support_tickets (user_id, subject, message) VALUES (?, ?, ?)',
      [req.user.id, subject, message]
    );
    
    return res.status(201).json({ 
      message: 'Support ticket created successfully',
      ticket_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

// Initialize the database and start the server
async function startServer() {
  // Initialize database first and get the configured pool
  pool = await initializeDatabase();
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Start the application
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});