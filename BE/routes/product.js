const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { AppDataSource, Product } = require('../src/config/database');
const { Like } = require('typeorm');

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

    const productRepository = AppDataSource.getRepository(Product);

    // Build where condition
    const whereCondition = search ? { product_name: Like(`%${search}%`) } : {};

    // Build order object
    const order = {};
    order[sortBy] = sortOrder.toUpperCase();

    // Calculate offset for pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const total = await productRepository.count({ where: whereCondition });

    // Get products with pagination
    const products = await productRepository.find({
      where: whereCondition,
      order: order,
      skip: offset,
      take: parseInt(limit)
    });

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

    const productRepository = AppDataSource.getRepository(Product);

    // Create product
    const product = productRepository.create({
      product_name,
      description,
      price,
      quantity,
      category
    });

    const savedProduct = await productRepository.save(product);

    res.status(201).json(savedProduct);
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

    const productRepository = AppDataSource.getRepository(Product);

    // Check if product exists
    const product = await productRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    if (product_name !== undefined) product.product_name = product_name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (category !== undefined) product.category = category;

    await productRepository.save(product);

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

    const productRepository = AppDataSource.getRepository(Product);

    // Check if product exists
    const product = await productRepository.findOne({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await productRepository.remove(product);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
