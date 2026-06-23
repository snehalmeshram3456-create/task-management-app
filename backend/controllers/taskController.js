const mongoose = require('mongoose');
const Task = require('../models/Task');

// Get all tasks with filtering and sorting
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, sort, search } = req.query;
    let filter = { createdBy: req.user.id };

    // Apply filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    let query = Task.find(filter);

    // Apply sorting
    if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else if (sort === 'priority') {
      query = query.sort({ priority: -1 });
    } else if (sort === 'dueDate') {
      query = query.sort({ dueDate: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const tasks = await query.exec();

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, category, assignedUser } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a task title'
      });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      category: category || 'Work',
      assignedUser: assignedUser || req.user.id,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Update fields
    const { title, description, priority, status, dueDate, category, assignedUser } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) {
      task.status = status;
      if (status === 'Completed') {
        task.completedAt = new Date();
      }
    }
    if (dueDate) task.dueDate = dueDate;
    if (category) task.category = category;
    if (assignedUser) task.assignedUser = assignedUser;

    task = await task.save();

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalTasks = await Task.countDocuments({ createdBy: userId });
    const completedTasks = await Task.countDocuments({ createdBy: userId, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ createdBy: userId, status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ createdBy: userId, status: 'In Progress' });

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      createdBy: userId,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() }
    });

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Weekly completion
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyCompletion = await Task.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
          completedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
        tasksByPriority,
        weeklyCompletion
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats
};
