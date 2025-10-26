const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { AppDataSource, User } = require('../src/config/database');
const { Not } = require('typeorm');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'name', 'email', 'userName', 'dob', 'phone', 'address', 'city', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' }
    });
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

    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: [
        { email: email },
        { userName: userName }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or Username already used' });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = userRepository.create({
      name,
      email,
      userName,
      password: hashedPassword,
      dob: dob || null,
      phone: phone || null,
      address: address || null,
      city: city || null
    });

    const savedUser = await userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser;
    res.status(201).json(userWithoutPassword);
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

    const userRepository = AppDataSource.getRepository(User);

    // Check if user exists
    const user = await userRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email or username is already used by another user
    if (email || userName) {
      const existingUser = await userRepository.findOne({
        where: [
          { email: email || '', id: Not(parseInt(id)) },
          { userName: userName || '', id: Not(parseInt(id)) }
        ]
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email or Username already used' });
      }
    }

    // Update user fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (userName !== undefined) user.userName = userName;
    if (dob !== undefined) user.dob = dob;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;

    await userRepository.save(user);

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

    const userRepository = AppDataSource.getRepository(User);

    // Check if user exists
    const user = await userRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userRepository.remove(user);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
