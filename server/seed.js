import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';
import { fileURLToPath } from 'url';
import path from 'path';

// Fix Node.js DNS resolution issues on Windows for MongoDB Atlas SRV connection strings
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Warning: Failed to set custom DNS servers for Node.js:', e.message);
}

import { User, Student, Company, Job, Application, Discussion, Resume, Notification } from './models.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Initial Mock Data
const CREDENTIALS = [
  { email: 'rahul@gmail.com', password: 'rahul123', role: 'student' },
  { email: 'newstudent@email.com', password: 'student123', role: 'student' },
  { email: 'newstudent201@email.com', password: 'student123', role: 'student' },
  { email: 'newstudent202@email.com', password: 'student123', role: 'student' },
  { email: 'newstudent203@email.com', password: 'student123', role: 'student' },
  { email: 'justin@gmail.com', password: 'justin123', role: 'student' },
  { email: 'newstudent205@email.com', password: 'student123', role: 'student' },
  { email: 'officer@placemate.com', password: 'officer123', role: 'officer' },
  { email: 'hod@placemate.com', password: 'hod123', role: 'hod' }
];

const COMPANIES = [
  { name: 'Google', sector: 'Technology', avgPackage: '25 LPA', hiredCount: 2 },
  { name: 'Amazon', sector: 'E-Commerce & Cloud', avgPackage: '18 LPA', hiredCount: 0 },
  { name: 'Microsoft', sector: 'Technology', avgPackage: '20 LPA', hiredCount: 1 },
  { name: 'TCS', sector: 'Consulting', avgPackage: '4.5 LPA', hiredCount: 0 },
  { name: 'Deloitte', sector: 'Finance & Advisory', avgPackage: '8 LPA', hiredCount: 0 }
];

const JOBS = [
  { 
    title: 'Software Engineer', 
    company: 'Google', 
    type: 'Job', 
    package: '25 LPA', 
    minCgpa: 8.5, 
    departments: ['CSE', 'IT'], 
    skillsRequired: ['Java', 'Data Structures', 'Algorithms', 'C++'],
    description: 'We are seeking a highly skilled Software Development Engineer to join our Core Search Infrastructure team. You will build and optimize scalable services that handle billions of daily queries.',
    location: 'Bangalore, India'
  },
  { 
    title: 'Cloud Architect Intern', 
    company: 'Amazon', 
    type: 'Internship', 
    package: '60k/month', 
    minCgpa: 7.5, 
    departments: ['CSE', 'ECE', 'IT'], 
    skillsRequired: ['AWS Services', 'Linux Shell', 'Python', 'Networking'],
    description: 'Join the AWS Solution Architect team to help our enterprise customers deploy secure, resilient, and optimized architectures. This internship offers hands-on mentorship.',
    location: 'Hyderabad, India'
  },
  { 
    title: 'Front-End Developer', 
    company: 'Microsoft', 
    type: 'Job', 
    package: '20 LPA', 
    minCgpa: 8.0, 
    departments: ['All'], 
    skillsRequired: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
    description: 'We are looking for creative and analytical frontend developers to collaborate on our cloud-based Productivity suite. Experience with modern React systems is highly valued.',
    location: 'Noida, India'
  },
  { 
    title: 'Associate Consultant', 
    company: 'Deloitte', 
    type: 'Job', 
    package: '8 LPA', 
    minCgpa: 7.0, 
    departments: ['All'], 
    skillsRequired: ['SQL Queries', 'Data Analysis', 'Excel', 'Communication'],
    description: 'Collaborate with global clients to diagnose business systems, configure ERP frameworks, and design relational databases. Focuses on tech strategy implementation.',
    location: 'Mumbai, India'
  },
  { 
    title: 'Systems Engineer', 
    company: 'TCS', 
    type: 'Job', 
    package: '4.5 LPA', 
    minCgpa: 6.0, 
    departments: ['All'], 
    skillsRequired: ['C++', 'Core Java', 'Database Basics', 'OS Systems'],
    description: 'Entry-level position for software operations, testing pipelines, and development modules. Features a comprehensive initial corporate training phase.',
    location: 'Chennai, India'
  }
];

const DISCUSSIONS = [
  {
    title: 'Google Coding Round Experience (CSE)',
    company: 'Google',
    category: 'Interview Experience',
    content: 'Completed the online assessment. First question was lowest common ancestor in a Binary Search Tree (BST). Second was a variation of 0/1 knapsack with multiple weight dimensions. Focus heavily on Trees & DP problems in Leetcode.',
    user: 'Priya Sharma',
    date: '2026-06-10'
  },
  {
    title: 'Deloitte Tech & HR Round Walkthrough',
    company: 'Deloitte',
    category: 'Interview Experience',
    content: 'First round was aptitude. Second round was technical, focusing on SQL join queries, relational design, and basics of OOPs. HR round focused on behavioral questions like resolving team conflicts.',
    user: 'Sneha Patel',
    date: '2026-06-13'
  }
];

export async function seedDatabase() {
  try {
    // 1. Clear existing database
    await User.deleteMany({});
    await Student.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Discussion.deleteMany({});
    await Resume.deleteMany({});
    await Notification.deleteMany({});

    console.log('Database cleared.');

    // 2. Seed Users & Students
    const userMap = {};
    const studentMap = {};

    for (const cred of CREDENTIALS) {
      const hashedPassword = bcrypt.hashSync(cred.password, 10);
      const user = await User.create({
        email: cred.email,
        password: hashedPassword,
        role: cred.role
      });
      userMap[cred.email] = user._id;
    }
    console.log('Users seeded.');

    // Seed student profiles
    const studentProfiles = [
      {
        email: 'rahul@gmail.com',
        name: 'Rahul Sharma',
        registerNo: '21BCE0456',
        cgpa: 8.45,
        department: 'CSE',
        year: 'Y4',
        skills: ['React', 'JavaScript', 'Node.js', 'CSS', 'HTML'],
        projects: ['E-commerce Microservices', 'Smart Traffic Management System'],
        certifications: ['AWS Cloud Practitioner', 'React Complete Guide'],
        achievements: ['1st Place College Hackathon', 'Dean\'s List Semester 6'],
        verified: false,
        profileStatus: 'PENDING',
        placementStatus: 'PLACED',
        readinessScore: 82
      },
      {
        email: 'newstudent@email.com',
        name: 'Not set',
        registerNo: '21CSE999',
        cgpa: null,
        department: '',
        year: '',
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        verified: false,
        profileStatus: 'SUBMITTED',
        placementStatus: 'NOT PLACED',
        readinessScore: 0
      },
      {
        email: 'newstudent201@email.com',
        name: 'Not set',
        registerNo: '21CSE201',
        cgpa: null,
        department: '',
        year: '',
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        verified: false,
        profileStatus: 'SUBMITTED',
        placementStatus: 'NOT PLACED',
        readinessScore: 0
      },
      {
        email: 'newstudent202@email.com',
        name: 'Not set',
        registerNo: '21CSE202',
        cgpa: null,
        department: '',
        year: '',
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        verified: false,
        profileStatus: 'SUBMITTED',
        placementStatus: 'NOT PLACED',
        readinessScore: 0
      },
      {
        email: 'newstudent203@email.com',
        name: 'Not set',
        registerNo: '21CSE203',
        cgpa: null,
        department: '',
        year: '',
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        verified: true,
        profileStatus: 'VERIFIED',
        placementStatus: 'NOT PLACED',
        readinessScore: 0
      },
      {
        email: 'justin@gmail.com',
        name: 'Justin Juby',
        registerNo: '21CSE204',
        cgpa: 9.67,
        department: 'AIML',
        year: 'Y2',
        skills: ['Python', 'Machine Learning', 'SQL', 'Algorithms'],
        projects: ['Machine Learning Stock Predictor', 'Hospital DBMS'],
        certifications: ['Oracle Java Professional'],
        achievements: ['ACM-ICPC Regionalist'],
        verified: true,
        profileStatus: 'VERIFIED',
        placementStatus: 'PLACED',
        readinessScore: 88
      },
      {
        email: 'newstudent205@email.com',
        name: 'Tuvva Abhilash Reddy',
        registerNo: '21CSE205',
        cgpa: 9.8,
        department: 'AIML',
        year: 'Y2',
        skills: ['Deep Learning', 'PyTorch', 'Data Analysis'],
        projects: ['Hybrid Formula Vehicle Design'],
        certifications: [],
        achievements: [],
        verified: true,
        profileStatus: 'VERIFIED',
        placementStatus: 'PLACED',
        readinessScore: 92
      }
    ];

    for (const prof of studentProfiles) {
      const uId = userMap[prof.email];
      if (uId) {
        const student = await Student.create({
          userId: uId,
          name: prof.name,
          registerNo: prof.registerNo,
          cgpa: prof.cgpa,
          department: prof.department,
          year: prof.year,
          skills: prof.skills,
          projects: prof.projects,
          certifications: prof.certifications,
          achievements: prof.achievements,
          verified: prof.verified,
          profileStatus: prof.profileStatus,
          placementStatus: prof.placementStatus,
          readinessScore: prof.readinessScore
        });
        studentMap[prof.email] = student._id;
      }
    }
    console.log('Student profiles seeded.');

    // 3. Seed Companies
    const companyDocs = await Company.insertMany(COMPANIES);
    console.log('Companies seeded.');

    // 4. Seed Jobs
    const jobDocs = await Job.insertMany(JOBS);
    console.log('Jobs seeded.');

    // Map jobs by title for references
    const jobMap = {};
    jobDocs.forEach(job => {
      jobMap[job.title] = job._id;
    });

    // 5. Seed Applications
    const applicationsToSeed = [
      {
        studentEmail: 'rahul@gmail.com',
        jobTitle: 'Front-End Developer',
        stage: 'Selected',
        date: '2026-06-12'
      },
      {
        studentEmail: 'justin@gmail.com',
        jobTitle: 'Software Engineer',
        stage: 'Selected',
        date: '2026-06-10'
      },
      {
        studentEmail: 'newstudent205@email.com',
        jobTitle: 'Software Engineer',
        stage: 'Selected',
        date: '2026-06-14'
      }
    ];

    for (const app of applicationsToSeed) {
      const sId = studentMap[app.studentEmail];
      const jId = jobMap[app.jobTitle];
      if (sId && jId) {
        await Application.create({
          studentId: sId,
          jobId: jId,
          stage: app.stage,
          date: app.date
        });
      }
    }
    console.log('Applications seeded.');

    // 6. Seed Discussions
    await Discussion.insertMany(DISCUSSIONS);
    console.log('Discussions seeded.');

    // 7. Seed Resumes
    const rahulId = studentMap['rahul@gmail.com'];
    if (rahulId) {
      await Resume.create({
        studentId: rahulId,
        name: 'Alex_Johnson_Resume_CSE_2026.pdf',
        date: '2026-06-05',
        primary: true
      });
      console.log('Resumes seeded.');
    }

    // 8. Seed Notifications
    if (rahulId) {
      await Notification.create([
        { studentId: rahulId, text: 'Google drive eligibility released.', read: false, date: '2026-06-20' },
        { studentId: rahulId, text: 'Microsoft interview scheduled.', read: false, date: '2026-06-21' }
      ]);
      console.log('Notifications seeded.');
    }

    console.log('Database seeding successfully finished!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run standalone if executed directly
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB Atlas for Seeding...');
      await seedDatabase();
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Connection error during seeding:', err);
      process.exit(1);
    });
}
