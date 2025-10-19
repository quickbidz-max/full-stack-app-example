const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, email, userName, dob, phone, address, city, createdAt, updatedAt FROM user ORDER BY createdAt DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create user
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('userName').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, userName, password, dob, phone, address, city } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM user WHERE email = ? OR userName = ?',
      [email, userName]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email or Username already used' });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO user (name, email, userName, password, dob, phone, address, city, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, userName, hashedPassword, dob || null, phone || null, address || null, city || null]
    );

    // Get created user
    const [users] = await db.execute(
      'SELECT id, name, email, userName, dob, phone, address, city, createdAt, updatedAt FROM user WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(users[0]);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('userName').optional().notEmpty().withMessage('Username cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, userName, dob, phone, address, city } = req.body;

    // Check if user exists
    const [users] = await db.execute(
      'SELECT * FROM user WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email or username is already used by another user
    if (email || userName) {
      const [existingUsers] = await db.execute(
        'SELECT * FROM user WHERE (email = ? OR userName = ?) AND id != ?',
        [email || '', userName || '', id]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email or Username already used' });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (userName !== undefined) {
      updateFields.push('userName = ?');
      updateValues.push(userName);
    }
    if (dob !== undefined) {
      updateFields.push('dob = ?');
      updateValues.push(dob);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(address);
    }
    if (city !== undefined) {
      updateFields.push('city = ?');
      updateValues.push(city);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await db.execute(
      `UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user (protected route)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await db.execute(
      'SELECT * FROM user WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.execute('DELETE FROM user WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
