const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Please select a valid priority level'
      },
      default: 'Medium'
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: 'Please select a valid status'
      },
      default: 'Pending'
    },
    dueDate: {
      type: Date
    },
    category: {
      type: String,
      enum: {
        values: ['Work', 'Personal', 'Shopping', 'Health', 'Other'],
        message: 'Please select a valid category'
      },
      default: 'Work'
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    completedAt: {
      type: Date
    },
    isOverdue: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for better query performance
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
