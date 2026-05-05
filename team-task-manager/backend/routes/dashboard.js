
const r=require("express").Router();
const Task=require("../models/Task");
const auth=require("../middleware/auth");

r.get("/",auth,async(req,res)=>{
 const tasks=await Task.find({assignedTo:req.user.id});
 const total=tasks.length;
 const done=tasks.filter(t=>t.status==="Done").length;
 const pending=tasks.filter(t=>t.status!=="Done").length;
 const overdue=tasks.filter(t=>t.dueDate && new Date(t.dueDate)<new Date() && t.status!=="Done").length;
 res.json({total,done,pending,overdue});
});

module.exports=r;
