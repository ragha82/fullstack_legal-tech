const mongoose = require('mongoose');
require('dotenv').config();

const Document = require('../models/Document');
const Case = require('../models/Case');
const Task = require('../models/Task');
const Deadline = require('../models/Deadline');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/legaltech';

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check Documents
    const documents = await Document.find();
    console.log('📄 DOCUMENTS:');
    console.log(`   Total: ${documents.length}`);
    if (documents.length > 0) {
      console.log('   Sample documents:');
      documents.slice(0, 3).forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.title} - Status: ${doc.status} - Client: ${doc.clientName}`);
      });
    }
    console.log('');

    // Check Cases
    const cases = await Case.find();
    console.log('⚖️  CASES:');
    console.log(`   Total: ${cases.length}`);
    if (cases.length > 0) {
      console.log('   Sample cases:');
      cases.slice(0, 3).forEach((caseItem, index) => {
        console.log(`   ${index + 1}. ${caseItem.caseNumber} - ${caseItem.title} - Status: ${caseItem.status}`);
      });
    }
    console.log('');

    // Check Tasks
    const tasks = await Task.find();
    console.log('✅ TASKS:');
    console.log(`   Total: ${tasks.length}`);
    if (tasks.length > 0) {
      console.log('   Sample tasks:');
      tasks.slice(0, 3).forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title} - Status: ${task.status} - Assigned: ${task.assignedTo}`);
      });
    }
    console.log('');

    // Check Deadlines
    const deadlines = await Deadline.find();
    console.log('📅 DEADLINES:');
    console.log(`   Total: ${deadlines.length}`);
    if (deadlines.length > 0) {
      console.log('   Sample deadlines:');
      deadlines.slice(0, 3).forEach((deadline, index) => {
        console.log(`   ${index + 1}. ${deadline.title} - Date: ${deadline.deadlineDate.toLocaleDateString()} - Status: ${deadline.status}`);
      });
    }
    console.log('');

    // Statistics Summary
    console.log('📊 SUMMARY:');
    console.log(`   Documents: ${documents.length}`);
    console.log(`   Cases: ${cases.length}`);
    console.log(`   Tasks: ${tasks.length}`);
    console.log(`   Deadlines: ${deadlines.length}`);
    console.log(`   Total Records: ${documents.length + cases.length + tasks.length + deadlines.length}`);

    // Check status distributions
    console.log('\n📈 STATUS DISTRIBUTIONS:');
    
    const docStatuses = await Document.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('   Documents by Status:');
    docStatuses.forEach(item => {
      console.log(`     ${item._id}: ${item.count}`);
    });

    const caseStatuses = await Case.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('   Cases by Status:');
    caseStatuses.forEach(item => {
      console.log(`     ${item._id}: ${item.count}`);
    });

    const taskStatuses = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('   Tasks by Status:');
    taskStatuses.forEach(item => {
      console.log(`     ${item._id}: ${item.count}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Data check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking data:', error);
    process.exit(1);
  }
}

checkData();

