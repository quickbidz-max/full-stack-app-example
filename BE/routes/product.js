const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', authenticateToken, [
  query('search').optional().isString(),
  query('sortBy').optional().isIn(['product_name', 'category', 'price', 'quantity', 'createdAt', 'updatedAt']),
  query('sortOrder').optional().isIn(['ASC', 'DESC']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, sortBy = 'createdAt', sortOrder = 'DESC', page = 1, limit = 10 } = req.query;

    // Build WHERE clause
    let whereClause = '';
    let queryParams = [];

    if (search) {
      whereClause = 'WHERE product_name LIKE ?';
      queryParams.push(`%${search}%`);
    }

    // Build ORDER BY clause
    const orderBy = `ORDER BY ${sortBy} ${sortOrder}`;

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM product ${whereClause}`;
    const [countResult] = await db.execute(countQuery, queryParams);
    const total = countResult[0].total;

    // Get products with pagination
    const productsQuery = `
      SELECT * FROM product 
      ${whereClause} 
      ${orderBy} 
      LIMIT ? OFFSET ?
    `;
    const [products] = await db.execute(productsQuery, [...queryParams, parseInt(limit), offset]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      data: products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create product
router.post('/', authenticateToken, [
  body('product_name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').notEmpty().withMessage('Price is required'),
  body('quantity').notEmpty().withMessage('Quantity is required'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product_name, description, price, quantity, category } = req.body;

    // Create product
    const [result] = await db.execute(
      'INSERT INTO product (product_name, description, price, quantity, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [product_name, description, price, quantity, category]
    );

    // Get created product
    const [products] = await db.execute(
      'SELECT * FROM product WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(products[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update product
router.put('/:id', authenticateToken, [
  body('product_name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().notEmpty().withMessage('Price cannot be empty'),
  body('quantity').optional().notEmpty().withMessage('Quantity cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { product_name, description, price, quantity, category } = req.body;

    // Check if product exists
    const [products] = await db.execute(
      'SELECT * FROM product WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (product_name !== undefined) {
      updateFields.push('product_name = ?');
      updateValues.push(product_name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (quantity !== undefined) {
      updateFields.push('quantity = ?');
      updateValues.push(quantity);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateFields.push('updatedAt = NOW()');
    updateValues.push(id);

    await db.execute(
      `UPDATE product SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [products] = await db.execute(
      'SELECT * FROM product WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.execute('DELETE FROM product WHERE id = ?', [id]);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
