const Resource = require('../models/Resource');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.getDashboard = catchAsync(async (req, res, next) => {
  const resources = await Resource.find({ status: 'approved' })
    .sort('-createdAt')
    .limit(6)
    .populate('uploader', 'name');
    
  res.render('dashboard', {
    title: 'Dashboard',
    resources
  });
});

exports.getLoginForm = (req, res) => {
  res.render('login', { title: 'Log into your account' });
};

exports.getSignupForm = (req, res) => {
  res.render('signup', { title: 'Create an account' });
};

exports.getUploadForm = (req, res) => {
  res.render('upload', { title: 'Upload Resource' });
};

exports.getAdminPanel = catchAsync(async (req, res, next) => {
  const pendingResources = await Resource.find({ status: 'pending' }).populate('uploader', 'name');
  
  res.render('admin', {
    title: 'Admin Panel',
    pendingResources
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'savedResources',
    populate: { path: 'uploader', select: 'name' }
  });
  
  const myUploads = await Resource.find({ uploader: req.user.id });

  res.render('profile', {
    title: 'My Profile',
    user,
    myUploads
  });
});

exports.getResources = catchAsync(async (req, res, next) => {
  let filter = { status: 'approved' };
  
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex }
    ];
  }
  
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const resources = await Resource.find(filter).sort('-createdAt').populate('uploader', 'name');
  
  res.render('resources', {
    title: 'All Resources',
    resources,
    search: req.query.search || '',
    category: req.query.category || ''
  });
});
