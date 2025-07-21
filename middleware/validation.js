const validateContactInput = (req, res, next) => {
  const {
    name,
    mobileNumber,
    emailId,
    natureOfServices,
    workRelated
  } = req.body;

  const errors = [];

  // Required field validation
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!mobileNumber || mobileNumber.trim().length === 0) {
    errors.push('Mobile number is required');
  }

  if (!emailId || emailId.trim().length === 0) {
    errors.push('Email ID is required');
  }

  if (!natureOfServices || natureOfServices.trim().length === 0) {
    errors.push('Nature of services is required');
  }

  if (!workRelated || workRelated.trim().length === 0) {
    errors.push('Work related field is required');
  }

  // Format validation
  if (emailId && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailId)) {
    errors.push('Please provide a valid email address');
  }

  if (mobileNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(mobileNumber)) {
    errors.push('Please provide a valid mobile number');
  }

  // Length validation
  if (name && name.length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  if (natureOfServices && natureOfServices.length > 200) {
    errors.push('Nature of services cannot exceed 200 characters');
  }

  if (workRelated && workRelated.length > 200) {
    errors.push('Work related field cannot exceed 200 characters');
  }

  if (req.body.note && req.body.note.length > 500) {
    errors.push('Note cannot exceed 500 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = { validateContactInput };