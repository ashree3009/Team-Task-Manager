const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    // Admins see all, members see assigned
    let query = {};
    if (req.user.role === 'Member') {
      query = { teamMembers: req.user.id };
    }
    
    const projects = await Project.find(query).populate('teamMembers', 'name email');
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('teamMembers', 'name email').populate('createdBy', 'name email');
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Access check
    if (req.user.role !== 'Admin' && !project.teamMembers.map(m => m._id.toString()).includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('teamMembers', 'name email');

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
