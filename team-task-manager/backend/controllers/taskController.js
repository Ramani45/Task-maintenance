const Task = require('../models/Task');

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            {
                $facet: {
                    // 1. Total tasks count
                    totalTasks: [{ $count: "count" }],
                    // 2. Group tasks by status (To Do, In Progress, Done)
                    statusCounts: [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    // 3. Overdue tasks (Deadline is before 'now' and status is not 'Done')
                    overdueTasks: [
                        { 
                            $match: { 
                                deadline: { $lt: new Date() }, 
                                status: { $ne: "Done" } 
                            } 
                        },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        res.json({
            total: stats[0].totalTasks[0]?.count || 0,
            byStatus: stats[0].statusCounts,
            overdue: stats[0].overdueTasks[0]?.count || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};