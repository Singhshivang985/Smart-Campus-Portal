const Resource = require('../models/Resource');
const User = require('../models/User');
const Log = require('../models/Log');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllResources = catchAsync(async (req, res, next) => {
  // Only show approved resources for non-admins unless explicitly queried
  if (!req.user || req.user.role !== 'Admin') {
    req.query.status = 'approved';
  }

  const features = new APIFeatures(Resource.find().populate('uploader', 'name email'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
  const resources = await features.query;

  res.status(200).json({
    status: 'success',
    results: resources.length,
    data: {
      resources
    }
  });
});

exports.createResource = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file.', 400));
  }

  const newResource = await Resource.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    fileUrl: `/uploads/${req.file.filename}`,
    uploader: req.user._id,
    // Auto-approve if uploaded by admin or faculty
    status: req.user.role === 'Student' ? 'pending' : 'approved'
  });

  await Log.create({ user: req.user._id, action: 'Uploaded Resource', details: `Resource ID: ${newResource._id}` });

  res.status(201).json({
    status: 'success',
    data: {
      resource: newResource
    }
  });
});

exports.getResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id).populate('uploader', 'name');

  if (!resource) {
    return next(new AppError('No resource found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      resource
    }
  });
});

exports.updateResourceStatus = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!resource) {
    return next(new AppError('No resource found with that ID', 404));
  }
  
  await Log.create({ user: req.user._id, action: `Resource ${req.body.status}`, details: `Resource ID: ${resource._id}` });

  res.status(200).json({
    status: 'success',
    data: {
      resource
    }
  });
});

exports.toggleBookmark = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const resourceId = req.params.id;

  const isBookmarked = user.savedResources.includes(resourceId);

  if (isBookmarked) {
    user.savedResources.pull(resourceId);
  } else {
    user.savedResources.push(resourceId);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: isBookmarked ? 'Resource removed from bookmarks' : 'Resource bookmarked'
  });
});

exports.incrementDownload = catchAsync(async (req, res, next) => {
  await Resource.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
  res.status(200).json({ status: 'success' });
});

exports.getAnalytics = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalResources = await Resource.countDocuments({ status: 'approved' });
  const pendingResources = await Resource.countDocuments({ status: 'pending' });
  
  const popularCategories = await Resource.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalResources,
      pendingResources,
      popularCategories
    }
  });
});
