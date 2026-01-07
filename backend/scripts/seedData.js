const mongoose = require('mongoose');
require('dotenv').config();

const Document = require('../models/Document');
const Case = require('../models/Case');
const Task = require('../models/Task');
const Deadline = require('../models/Deadline');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/legaltech';

// Sample data
const sampleCases = [
  {
    caseNumber: 'CASE-2024-001',
    title: 'Corporate Merger Agreement',
    caseType: 'Corporate',
    status: 'In Progress',
    clientName: 'TechCorp Inc.',
    assignedLawyer: 'Sarah Johnson',
    startDate: new Date('2024-01-15'),
    expectedEndDate: new Date('2024-06-30'),
    priority: 'High',
    estimatedHours: 120,
    billedHours: 45,
    description: 'Handling merger between TechCorp and InnovateLabs'
  },
  {
    caseNumber: 'CASE-2024-002',
    title: 'Employment Dispute Resolution',
    caseType: 'Employment',
    status: 'Open',
    clientName: 'Global Industries',
    assignedLawyer: 'Michael Chen',
    startDate: new Date('2024-02-01'),
    expectedEndDate: new Date('2024-05-15'),
    priority: 'Medium',
    estimatedHours: 80,
    billedHours: 20,
    description: 'Resolving employment contract disputes'
  },
  {
    caseNumber: 'CASE-2024-003',
    title: 'Patent Infringement Case',
    caseType: 'Intellectual Property',
    status: 'In Progress',
    clientName: 'InnovateLabs',
    assignedLawyer: 'Emily Rodriguez',
    startDate: new Date('2024-01-20'),
    expectedEndDate: new Date('2024-08-31'),
    priority: 'Urgent',
    estimatedHours: 200,
    billedHours: 85,
    description: 'Defending patent infringement claims'
  },
  {
    caseNumber: 'CASE-2024-004',
    title: 'Family Trust Settlement',
    caseType: 'Family',
    status: 'On Hold',
    clientName: 'Smith Family Trust',
    assignedLawyer: 'David Williams',
    startDate: new Date('2023-11-10'),
    expectedEndDate: new Date('2024-04-30'),
    priority: 'Medium',
    estimatedHours: 60,
    billedHours: 35,
    description: 'Settling family trust distribution'
  },
  {
    caseNumber: 'CASE-2024-005',
    title: 'Contract Breach Litigation',
    caseType: 'Civil',
    status: 'Open',
    clientName: 'Manufacturing Co.',
    assignedLawyer: 'Sarah Johnson',
    startDate: new Date('2024-02-15'),
    expectedEndDate: new Date('2024-07-20'),
    priority: 'High',
    estimatedHours: 150,
    billedHours: 30,
    description: 'Litigating contract breach claims'
  }
];

const sampleDocuments = [
  {
    title: 'Merger Agreement Draft',
    documentType: 'Contract',
    status: 'In Review',
    clientName: 'TechCorp Inc.',
    uploadedDate: new Date('2024-03-01'),
    priority: 'High',
    description: 'Initial draft of merger agreement'
  },
  {
    title: 'Employment Contract Template',
    documentType: 'Agreement',
    status: 'Approved',
    clientName: 'Global Industries',
    uploadedDate: new Date('2024-02-15'),
    priority: 'Medium',
    description: 'Standard employment contract template'
  },
  {
    title: 'Patent Application Brief',
    documentType: 'Legal Brief',
    status: 'Pending',
    clientName: 'InnovateLabs',
    uploadedDate: new Date('2024-03-10'),
    priority: 'Urgent',
    description: 'Brief for patent application defense'
  },
  {
    title: 'Court Filing - Motion to Dismiss',
    documentType: 'Court Filing',
    status: 'In Review',
    clientName: 'Manufacturing Co.',
    uploadedDate: new Date('2024-03-05'),
    priority: 'High',
    description: 'Motion to dismiss filed with court'
  },
  {
    title: 'Compliance Report Q1 2024',
    documentType: 'Compliance Report',
    status: 'Approved',
    clientName: 'TechCorp Inc.',
    uploadedDate: new Date('2024-03-20'),
    priority: 'Low',
    description: 'Quarterly compliance report'
  },
  {
    title: 'Trust Distribution Agreement',
    documentType: 'Agreement',
    status: 'Pending',
    clientName: 'Smith Family Trust',
    uploadedDate: new Date('2024-02-28'),
    priority: 'Medium',
    description: 'Agreement for trust distribution'
  }
];

const sampleTasks = [
  {
    title: 'Review Merger Agreement',
    description: 'Review and provide feedback on merger agreement draft',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    dueDate: new Date('2024-03-25'),
    estimatedHours: 8,
    actualHours: 3,
    category: 'Review'
  },
  {
    title: 'Research Patent Precedents',
    description: 'Research similar patent cases for defense strategy',
    status: 'In Progress',
    priority: 'Urgent',
    assignedTo: 'Emily Rodriguez',
    dueDate: new Date('2024-03-22'),
    estimatedHours: 12,
    actualHours: 7,
    category: 'Research'
  },
  {
    title: 'Draft Employment Contract',
    description: 'Draft new employment contract for client',
    status: 'Completed',
    priority: 'Medium',
    assignedTo: 'Michael Chen',
    dueDate: new Date('2024-03-15'),
    completedDate: new Date('2024-03-14'),
    estimatedHours: 6,
    actualHours: 5,
    category: 'Drafting'
  },
  {
    title: 'Prepare Court Filing Documents',
    description: 'Prepare all necessary documents for court filing',
    status: 'Not Started',
    priority: 'High',
    assignedTo: 'Sarah Johnson',
    dueDate: new Date('2024-03-28'),
    estimatedHours: 10,
    category: 'Filing'
  },
  {
    title: 'Client Meeting - Trust Settlement',
    description: 'Meet with client to discuss trust settlement options',
    status: 'Completed',
    priority: 'Medium',
    assignedTo: 'David Williams',
    dueDate: new Date('2024-03-18'),
    completedDate: new Date('2024-03-18'),
    estimatedHours: 2,
    actualHours: 2,
    category: 'Meeting'
  },
  {
    title: 'Update Compliance Documentation',
    description: 'Update all compliance documentation for Q1',
    status: 'In Progress',
    priority: 'Low',
    assignedTo: 'Michael Chen',
    dueDate: new Date('2024-03-30'),
    estimatedHours: 4,
    actualHours: 2,
    category: 'Other'
  }
];

const sampleDeadlines = [
  {
    title: 'Court Filing Deadline',
    description: 'File response to motion',
    deadlineDate: new Date('2024-03-25'),
    deadlineType: 'Court Filing',
    status: 'Due Soon',
    clientName: 'Manufacturing Co.',
    assignedTo: 'Sarah Johnson',
    priority: 'Urgent',
    reminderDate: new Date('2024-03-20')
  },
  {
    title: 'Patent Response Deadline',
    description: 'Respond to patent office inquiry',
    deadlineDate: new Date('2024-04-05'),
    deadlineType: 'Response Required',
    status: 'Upcoming',
    clientName: 'InnovateLabs',
    assignedTo: 'Emily Rodriguez',
    priority: 'High',
    reminderDate: new Date('2024-03-30')
  },
  {
    title: 'Contract Expiry Review',
    description: 'Review and renew service contract',
    deadlineDate: new Date('2024-05-15'),
    deadlineType: 'Contract Expiry',
    status: 'Upcoming',
    clientName: 'TechCorp Inc.',
    assignedTo: 'Sarah Johnson',
    priority: 'Medium',
    reminderDate: new Date('2024-05-01')
  },
  {
    title: 'Compliance Report Submission',
    description: 'Submit quarterly compliance report',
    deadlineDate: new Date('2024-04-01'),
    deadlineType: 'Compliance Deadline',
    status: 'Due Soon',
    clientName: 'Global Industries',
    assignedTo: 'Michael Chen',
    priority: 'High',
    reminderDate: new Date('2024-03-25')
  },
  {
    title: 'Hearing Date',
    description: 'Court hearing for employment dispute',
    deadlineDate: new Date('2024-04-20'),
    deadlineType: 'Hearing',
    status: 'Upcoming',
    clientName: 'Global Industries',
    assignedTo: 'Michael Chen',
    priority: 'Urgent',
    reminderDate: new Date('2024-04-15')
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Document.deleteMany({});
    await Case.deleteMany({});
    await Task.deleteMany({});
    await Deadline.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert cases first (documents and tasks reference cases)
    const createdCases = await Case.insertMany(sampleCases);
    console.log(`✅ Inserted ${createdCases.length} cases`);

    // Link some documents to cases
    sampleDocuments[0].caseId = createdCases[0]._id;
    sampleDocuments[1].caseId = createdCases[1]._id;
    sampleDocuments[2].caseId = createdCases[2]._id;
    sampleDocuments[3].caseId = createdCases[4]._id;
    sampleDocuments[5].caseId = createdCases[3]._id;

    const createdDocuments = await Document.insertMany(sampleDocuments);
    console.log(`✅ Inserted ${createdDocuments.length} documents`);

    // Link some tasks to cases
    sampleTasks[0].caseId = createdCases[0]._id;
    sampleTasks[1].caseId = createdCases[2]._id;
    sampleTasks[2].caseId = createdCases[1]._id;
    sampleTasks[3].caseId = createdCases[4]._id;
    sampleTasks[4].caseId = createdCases[3]._id;

    const createdTasks = await Task.insertMany(sampleTasks);
    console.log(`✅ Inserted ${createdTasks.length} tasks`);

    // Link some deadlines to cases
    sampleDeadlines[0].caseId = createdCases[4]._id;
    sampleDeadlines[1].caseId = createdCases[2]._id;
    sampleDeadlines[2].caseId = createdCases[0]._id;
    sampleDeadlines[3].caseId = createdCases[1]._id;
    sampleDeadlines[4].caseId = createdCases[1]._id;

    const createdDeadlines = await Deadline.insertMany(sampleDeadlines);
    console.log(`✅ Inserted ${createdDeadlines.length} deadlines`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Cases: ${createdCases.length}`);
    console.log(`- Documents: ${createdDocuments.length}`);
    console.log(`- Tasks: ${createdTasks.length}`);
    console.log(`- Deadlines: ${createdDeadlines.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

