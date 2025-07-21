const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic phone number validation (adjust regex as needed for your region)
        return /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Please enter a valid mobile number'
    }
  },
  emailId: {
    type: String,
    required: [true, 'Email ID is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  natureOfServices: {
    type: String,
    required: [true, 'Nature of services is required'],
    trim: true,
    maxlength: [200, 'Nature of services cannot exceed 200 characters']
  },
  workRelated: {
    type: String,
    required: [true, 'Work related field is required'],
    trim: true,
    maxlength: [200, 'Work related field cannot exceed 200 characters']
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'Note cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  versionKey: false // Removes __v field
});

// Index for better query performance
contactSchema.index({ emailId: 1 });
contactSchema.index({ createdAt: -1 });

// Instance method to get formatted contact info
contactSchema.methods.getFormattedInfo = function() {
  return {
    id: this._id,
    name: this.name,
    contact: {
      mobile: this.mobileNumber,
      email: this.emailId
    },
    services: {
      nature: this.natureOfServices,
      workRelated: this.workRelated
    },
    note: this.note,
    submittedAt: this.createdAt
  };
};

module.exports = mongoose.model('Contact', contactSchema);