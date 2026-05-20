const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    let query = {};
    
    // Filter by project, status, priority, assignedTo
    if (req.query.project) query.project = req.query.project;
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    
    // If Member, only see assigned tasks
    if (req.user.role === 'Member') {
      query.assignedTo = req.user.id;
    } else if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('project', 'title');
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // A member can only update status. Admin can update everything.
    let updateData = req.body;
    if (req.user.role === 'Member') {
       if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
         return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
       }
       updateData = { status: req.body.status };
    }

    task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('assignedTo', 'name email').populate('project', 'title');

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
