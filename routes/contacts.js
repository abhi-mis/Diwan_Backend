const express = require('express');
const Contact = require('../models/Contact');
const { validateContactInput } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /api/v1/contacts
 * @desc    Create a new contact
 * @access  Public
 */
router.post('/', validateContactInput, async (req, res) => {
  try {
    const {
      name,
      mobileNumber,
      emailId,
      natureOfServices,
      workRelated,
      note
    } = req.body;

    // Check if contact with this email already exists
    const existingContact = await Contact.findOne({ emailId: emailId.toLowerCase() });
    if (existingContact) {
      return res.status(400).json({
        status: 'error',
        message: 'A contact with this email already exists'
      });
    }

    // Create new contact
    const contact = new Contact({
      name,
      mobileNumber,
      emailId,
      natureOfServices,
      workRelated,
      note
    });

    const savedContact = await contact.save();

    res.status(201).json({
      status: 'success',
      message: 'Contact created successfully',
      data: {
        contact: savedContact.getFormattedInfo()
      }
    });

  } catch (error) {
    console.error('Error creating contact:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors: errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating contact'
    });
  }
});

/**
 * @route   GET /api/v1/contacts
 * @desc    Get all contacts with optional filtering and pagination
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      natureOfServices,
      workRelated
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { emailId: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by nature of services
    if (natureOfServices) {
      filter.natureOfServices = { $regex: natureOfServices, $options: 'i' };
    }

    // Filter by work related
    if (workRelated) {
      filter.workRelated = { $regex: workRelated, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const totalContacts = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalContacts / parseInt(limit));

    // Format response data
    const formattedContacts = contacts.map(contact => contact.getFormattedInfo());

    res.status(200).json({
      status: 'success',
      message: 'Contacts retrieved successfully',
      data: {
        contacts: formattedContacts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalContacts,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching contacts'
    });
  }
});

/**
 * @route   GET /api/v1/contacts/stats
 * @desc    Get contact statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    // Get top nature of services
    const topServices = await Contact.aggregate([
      { $group: { _id: '$natureOfServices', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalContacts,
        recentContacts,
        topServices: topServices.map(item => ({
          service: item._id,
          count: item.count
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching statistics'
    });
  }
});

module.exports = router;