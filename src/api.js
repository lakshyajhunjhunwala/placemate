// API Client for Placemate Ecosystem
// Supports:
// 1. Live Express Backend (connected to MongoDB Atlas) when running locally or configured via env variables.
// 2. Client-side localStorage Mock Fallback when running on Vercel/GitHub Pages without a backend configured.

const API_BASE = import.meta.env.VITE_API_URL || '';

// Determine if we should fall back to mock client-side storage
const isMockFallback = () => {
  // If an explicit backend API URL is configured, do not fall back.
  if (import.meta.env.VITE_API_URL) return false;
  // If running locally, we expect the local backend to be run.
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return !isLocal;
};

// Helper to get headers with JWT token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Recursive _id mapping helper
function mapId(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(mapId);
  }
  if (typeof obj === 'object') {
    if (obj instanceof Date) return obj;
    const newObj = {};
    for (const key in obj) {
      if (key === '_id') {
        newObj.id = obj._id.toString();
        newObj._id = obj._id;
      } else {
        newObj[key] = mapId(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// HTTP API request wrapper
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = getHeaders();
  
  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const resData = await response.json();
  return mapId(resData);
}

// ---------------- LOCALSTORAGE MOCK SYSTEM ----------------
const MOCK_STORAGE_KEY = 'placemate_mock_db';

const getMockDb = () => {
  let dbStr = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!dbStr) {
    // Seed initial mock database in localStorage
    const initialDb = {
      users: [
        { id: 'u-1', email: 'rahul@gmail.com', password: 'rahul123', role: 'student' },
        { id: 'u-2', email: 'newstudent@email.com', password: 'student123', role: 'student' },
        { id: 'u-3', email: 'newstudent201@email.com', password: 'student123', role: 'student' },
        { id: 'u-4', email: 'newstudent202@email.com', password: 'student123', role: 'student' },
        { id: 'u-5', email: 'newstudent203@email.com', password: 'student123', role: 'student' },
        { id: 'u-6', email: 'justin@gmail.com', password: 'justin123', role: 'student' },
        { id: 'u-7', email: 'newstudent205@email.com', password: 'student123', role: 'student' },
        { id: 'u-8', email: 'officer@placemate.com', password: 'officer123', role: 'officer' },
        { id: 'u-9', email: 'hod@placemate.com', password: 'hod123', role: 'hod' }
      ],
      students: [
        {
          id: 'stud-1',
          userId: 'u-1',
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
        { id: 'stud-2', userId: 'u-2', email: 'newstudent@email.com', name: 'Not set', registerNo: '21CSE999', cgpa: null, department: '', year: '', skills: [], projects: [], certifications: [], achievements: [], verified: false, profileStatus: 'SUBMITTED', placementStatus: 'NOT PLACED', readinessScore: 0 },
        { id: 'stud-3', userId: 'u-3', email: 'newstudent201@email.com', name: 'Not set', registerNo: '21CSE201', cgpa: null, department: '', year: '', skills: [], projects: [], certifications: [], achievements: [], verified: false, profileStatus: 'SUBMITTED', placementStatus: 'NOT PLACED', readinessScore: 0 },
        { id: 'stud-4', userId: 'u-4', email: 'newstudent202@email.com', name: 'Not set', registerNo: '21CSE202', cgpa: null, department: '', year: '', skills: [], projects: [], certifications: [], achievements: [], verified: false, profileStatus: 'SUBMITTED', placementStatus: 'NOT PLACED', readinessScore: 0 },
        { id: 'stud-5', userId: 'u-5', email: 'newstudent203@email.com', name: 'Not set', registerNo: '21CSE203', cgpa: null, department: '', year: '', skills: [], projects: [], certifications: [], achievements: [], verified: true, profileStatus: 'VERIFIED', placementStatus: 'NOT PLACED', readinessScore: 0 },
        { id: 'stud-6', userId: 'u-6', email: 'justin@gmail.com', name: 'Justin Juby', registerNo: '21CSE204', cgpa: 9.67, department: 'AIML', year: 'Y2', skills: ['Python', 'Machine Learning', 'SQL', 'Algorithms'], projects: ['Machine Learning Stock Predictor', 'Hospital DBMS'], certifications: ['Oracle Java Professional'], achievements: ['ACM-ICPC Regionalist'], verified: true, profileStatus: 'VERIFIED', placementStatus: 'PLACED', readinessScore: 88 },
        { id: 'stud-7', userId: 'u-7', email: 'newstudent205@email.com', name: 'Tuvva Abhilash Reddy', registerNo: '21CSE205', cgpa: 9.8, department: 'AIML', year: 'Y2', skills: ['Deep Learning', 'PyTorch', 'Data Analysis'], projects: ['Hybrid Formula Vehicle Design'], certifications: [], achievements: [], verified: true, profileStatus: 'VERIFIED', placementStatus: 'PLACED', readinessScore: 92 }
      ],
      companies: [
        { id: 'comp-1', name: 'Google', sector: 'Technology', avgPackage: '25 LPA', hiredCount: 2 },
        { id: 'comp-2', name: 'Amazon', sector: 'E-Commerce & Cloud', avgPackage: '18 LPA', hiredCount: 0 },
        { id: 'comp-3', name: 'Microsoft', sector: 'Technology', avgPackage: '20 LPA', hiredCount: 1 },
        { id: 'comp-4', name: 'TCS', sector: 'Consulting', avgPackage: '4.5 LPA', hiredCount: 0 },
        { id: 'comp-5', name: 'Deloitte', sector: 'Finance & Advisory', avgPackage: '8 LPA', hiredCount: 0 }
      ],
      jobs: [
        { id: 'job-1', title: 'Software Engineer', company: 'Google', type: 'Job', package: '25 LPA', minCgpa: 8.5, departments: ['CSE', 'IT'], skillsRequired: ['Java', 'Data Structures', 'Algorithms', 'C++'], description: 'We are seeking a highly skilled Software Development Engineer to join our Core Search Infrastructure team. You will build and optimize scalable services that handle billions of daily queries.', location: 'Bangalore, India' },
        { id: 'job-2', title: 'Cloud Architect Intern', company: 'Amazon', type: 'Internship', package: '60k/month', minCgpa: 7.5, departments: ['CSE', 'ECE', 'IT'], skillsRequired: ['AWS Services', 'Linux Shell', 'Python', 'Networking'], description: 'Join the AWS Solution Architect team to help our enterprise customers deploy secure, resilient, and optimized architectures. This internship offers hands-on mentorship.', location: 'Hyderabad, India' },
        { id: 'job-3', title: 'Front-End Developer', company: 'Microsoft', type: 'Job', package: '20 LPA', minCgpa: 8.0, departments: ['All'], skillsRequired: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'], description: 'We are looking for creative and analytical frontend developers to collaborate on our cloud-based Productivity suite. Experience with modern React systems is highly valued.', location: 'Noida, India' },
        { id: 'job-4', title: 'Associate Consultant', company: 'Deloitte', type: 'Job', package: '8 LPA', minCgpa: 7.0, departments: ['All'], skillsRequired: ['SQL Queries', 'Data Analysis', 'Excel', 'Communication'], description: 'Collaborate with global clients to diagnose business systems, configure ERP frameworks, and design relational databases. Focuses on tech strategy implementation.', location: 'Mumbai, India' },
        { id: 'job-5', title: 'Systems Engineer', company: 'TCS', type: 'Job', package: '4.5 LPA', minCgpa: 6.0, departments: ['All'], skillsRequired: ['C++', 'Core Java', 'Database Basics', 'OS Systems'], description: 'Entry-level position for software operations, testing pipelines, and development modules. Features a comprehensive initial corporate training phase.', location: 'Chennai, India' }
      ],
      applications: [
        { id: 'app-1', studentId: 'stud-1', jobId: 'job-3', stage: 'Selected', date: '2026-06-12' },
        { id: 'app-2', studentId: 'stud-6', jobId: 'job-1', stage: 'Selected', date: '2026-06-10' },
        { id: 'app-3', studentId: 'stud-7', jobId: 'job-1', stage: 'Selected', date: '2026-06-14' }
      ],
      discussions: [
        { id: 'disc-1', title: 'Google Coding Round Experience (CSE)', company: 'Google', category: 'Interview Experience', content: 'Completed the online assessment. First question was lowest common ancestor in a Binary Search Tree (BST). Second was a variation of 0/1 knapsack with multiple weight dimensions. Focus heavily on Trees & DP problems in Leetcode.', user: 'Priya Sharma', date: '2026-06-10' },
        { id: 'disc-2', title: 'Deloitte Tech & HR Round Walkthrough', company: 'Deloitte', category: 'Interview Experience', content: 'First round was aptitude. Second round was technical, focusing on SQL join queries, relational design, and basics of OOPs. HR round focused on behavioral questions like resolving team conflicts.', user: 'Sneha Patel', date: '2026-06-13' }
      ],
      resumes: [
        { id: 'res-1', studentId: 'stud-1', name: 'Alex_Johnson_Resume_CSE_2026.pdf', date: '2026-06-05', primary: true }
      ],
      notifications: [
        { id: 'n-1', studentId: 'stud-1', text: 'Google drive eligibility released.', read: false, date: '2026-06-20' },
        { id: 'n-2', studentId: 'stud-1', text: 'Microsoft interview scheduled.', read: false, date: '2026-06-21' }
      ]
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialDb));
    return initialDb;
  }
  return JSON.parse(dbStr);
};

const saveMockDb = (db) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
};

// Mock implementation of API client
const mockApi = {
  login: async (email, password) => {
    const db = getMockDb();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials.');
    }
    const token = 'mock_jwt_token_' + user.id;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    let studentProfile = null;
    if (user.role === 'student') {
      studentProfile = db.students.find(s => s.userId === user.id);
      if (studentProfile) {
        localStorage.setItem('studentId', studentProfile.id);
      }
    }
    return { token, user, studentProfile };
  },

  register: async (registerData) => {
    const db = getMockDb();
    const existing = db.users.find(u => u.email === registerData.email);
    if (existing) throw new Error('Email already registered.');
    
    const uId = 'u-' + Date.now();
    const sId = 'stud-' + Date.now();
    
    const newUser = {
      id: uId,
      email: registerData.email,
      password: registerData.password,
      role: 'student'
    };
    
    const newStudent = {
      id: sId,
      userId: uId,
      email: registerData.email,
      name: registerData.name,
      registerNo: registerData.registerNo || '',
      department: registerData.department || '',
      year: registerData.year || '',
      cgpa: null,
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      verified: false,
      profileStatus: 'PENDING',
      placementStatus: 'NOT PLACED',
      readinessScore: 0
    };
    
    db.users.push(newUser);
    db.students.push(newStudent);
    saveMockDb(db);
    
    const token = 'mock_jwt_token_' + uId;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('studentId', sId);
    
    return { token, user: newUser, studentProfile: newStudent };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('studentId');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getStudentProfile: async () => {
    const db = getMockDb();
    const studentId = localStorage.getItem('studentId');
    const profile = db.students.find(s => s.id === studentId);
    if (!profile) throw new Error('Profile not found');
    return profile;
  },

  updateStudentProfile: async (profileData) => {
    const db = getMockDb();
    const studentId = localStorage.getItem('studentId');
    const idx = db.students.findIndex(s => s.id === studentId);
    if (idx === -1) throw new Error('Profile not found');
    
    db.students[idx] = {
      ...db.students[idx],
      ...profileData,
      profileStatus: db.students[idx].profileStatus === 'PENDING' ? 'SUBMITTED' : db.students[idx].profileStatus
    };
    saveMockDb(db);
    return db.students[idx];
  },

  getStudents: async () => {
    const db = getMockDb();
    return db.students.map(s => {
      const user = db.users.find(u => u.id === s.userId);
      return { ...s, email: user ? user.email : 'N/A' };
    });
  },

  verifyStudent: async (id, verified) => {
    const db = getMockDb();
    const idx = db.students.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Student not found');
    db.students[idx].verified = verified;
    db.students[idx].profileStatus = verified ? 'VERIFIED' : 'SUBMITTED';
    saveMockDb(db);
    return db.students[idx];
  },

  getCompanies: async () => {
    const db = getMockDb();
    return db.companies;
  },

  addCompany: async (companyData) => {
    const db = getMockDb();
    const newCompany = {
      id: 'comp-' + Date.now(),
      hiredCount: 0,
      ...companyData
    };
    db.companies.push(newCompany);
    saveMockDb(db);
    return newCompany;
  },

  getJobs: async () => {
    const db = getMockDb();
    return db.jobs;
  },

  addJob: async (jobData) => {
    const db = getMockDb();
    const newJob = {
      id: 'job-' + Date.now(),
      ...jobData
    };
    db.jobs.push(newJob);
    saveMockDb(db);
    return newJob;
  },

  getApplications: async () => {
    const db = getMockDb();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    let apps = db.applications;
    if (user && user.role === 'student') {
      const studentId = localStorage.getItem('studentId');
      apps = db.applications.filter(a => a.studentId === studentId);
    }
    
    return apps.map(app => {
      const student = db.students.find(s => s.id === app.studentId);
      const studentUser = student ? db.users.find(u => u.id === student.userId) : null;
      const job = db.jobs.find(j => j.id === app.jobId);
      return {
        id: app.id,
        studentId: app.studentId,
        studentName: student ? student.name : 'N/A',
        studentRegisterNo: student ? student.registerNo : 'N/A',
        studentCgpa: student ? student.cgpa : null,
        studentEmail: studentUser ? studentUser.email : 'N/A',
        jobId: app.jobId,
        jobTitle: job ? job.title : 'N/A',
        companyName: job ? job.company : 'N/A',
        stage: app.stage,
        date: app.date
      };
    });
  },

  applyForJob: async (jobId) => {
    const db = getMockDb();
    const studentId = localStorage.getItem('studentId');
    const job = db.jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');
    
    const existing = db.applications.find(a => a.studentId === studentId && a.jobId === jobId);
    if (existing) throw new Error('Already applied.');

    const newApp = {
      id: 'app-' + Date.now(),
      studentId,
      jobId,
      stage: 'Applied',
      date: new Date().toISOString().split('T')[0]
    };
    db.applications.push(newApp);
    saveMockDb(db);

    return {
      id: newApp.id,
      studentId,
      jobId,
      jobTitle: job.title,
      companyName: job.company,
      stage: newApp.stage,
      date: newApp.date
    };
  },

  updateApplicationStage: async (appId, stage) => {
    const db = getMockDb();
    const idx = db.applications.findIndex(a => a.id === appId);
    if (idx === -1) throw new Error('Application not found');
    
    const prevStage = db.applications[idx].stage;
    db.applications[idx].stage = stage;
    
    if (stage === 'Selected' && prevStage !== 'Selected') {
      const job = db.jobs.find(j => j.id === db.applications[idx].jobId);
      if (job) {
        const compIdx = db.companies.findIndex(c => c.name === job.company);
        if (compIdx !== -1) {
          db.companies[compIdx].hiredCount += 1;
        }
      }
      const studentIdx = db.students.findIndex(s => s.id === db.applications[idx].studentId);
      if (studentIdx !== -1) {
        db.students[studentIdx].placementStatus = 'PLACED';
      }
    }
    saveMockDb(db);
    return { id: appId, stage };
  },

  getDiscussions: async () => {
    const db = getMockDb();
    return db.discussions;
  },

  addDiscussionPost: async (postData) => {
    const db = getMockDb();
    const userStr = localStorage.getItem('user');
    const userObj = userStr ? JSON.parse(userStr) : null;
    
    let userName = 'Anonymous';
    if (userObj) {
      if (userObj.role === 'student') {
        const studentId = localStorage.getItem('studentId');
        const student = db.students.find(s => s.id === studentId);
        if (student && student.name) userName = student.name;
      } else {
        userName = userObj.role === 'officer' ? 'Placement Officer' : 'HOD';
      }
    }

    const newPost = {
      id: 'disc-' + Date.now(),
      user: userName,
      date: new Date().toISOString().split('T')[0],
      ...postData
    };
    db.discussions.unshift(newPost);
    saveMockDb(db);
    return newPost;
  },

  getResumes: async () => {
    const db = getMockDb();
    const studentId = localStorage.getItem('studentId');
    return db.resumes.filter(r => r.studentId === studentId);
  },

  addResume: async (name) => {
    const db = getMockDb();
    const studentId = localStorage.getItem('studentId');
    const studentResumes = db.resumes.filter(r => r.studentId === studentId);
    
    const newResume = {
      id: 'res-' + Date.now(),
      studentId,
      name,
      date: new Date().toISOString().split('T')[0],
      primary: studentResumes.length === 0
    };
    db.resumes.push(newResume);
    saveMockDb(db);
    return newResume;
  },

  deleteResume: async (id) => {
    const db = getMockDb();
    const studentId = localStorage.getItem('studentId');
    const idx = db.resumes.findIndex(r => r.id === id && r.studentId === studentId);
    if (idx === -1) throw new Error('Resume not found');
    const wasPrimary = db.resumes[idx].primary;
    db.resumes.splice(idx, 1);
    
    if (wasPrimary) {
      const remaining = db.resumes.find(r => r.studentId === studentId);
      if (remaining) remaining.primary = true;
    }
    saveMockDb(db);
    return null;
  },

  setPrimaryResume: async (id) => {
    const db = getMockDb();
    const studentId = localStorage.getItem('studentId');
    db.resumes.forEach(r => {
      if (r.studentId === studentId) {
        r.primary = (r.id === id);
      }
    });
    saveMockDb(db);
    return null;
  },

  getNotifications: async () => {
    const db = getMockDb();
    const studentId = localStorage.getItem('studentId');
    return db.notifications.filter(n => n.studentId === studentId);
  },

  markNotificationRead: async (id) => {
    const db = getMockDb();
    const idx = db.notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      db.notifications[idx].read = true;
      saveMockDb(db);
      return { id, read: true };
    }
    throw new Error('Notification not found');
  },

  sendAiChatMessage: async (message, cgpa) => {
    let responseText = "That's an interesting question! For placement prep, I highly recommend building projects and practicing Data Structures & Algorithms on a regular basis. Would you like details on a specific role roadmap?";
    const msgLower = message.toLowerCase();
    
    if (msgLower.includes('resume') || msgLower.includes('cv')) {
      responseText = "To make a stand-out resume, keep it to one page, highlight quantifiable metrics in projects (e.g., 'reduced load time by 30%'), and list skills matching the job description. Don't forget to upload it to our Resume Vault!";
    } else if (msgLower.includes('cgpa') || msgLower.includes('gpa') || msgLower.includes('eligibility')) {
      responseText = `Your current CGPA is ${cgpa || 'N/A'}. Many top recruiting companies require a minimum CGPA of 7.5 or 8.0, and super-dream companies sometimes set thresholds at 8.5. Keep working hard to maintain or boost it!`;
    } else if (msgLower.includes('interview') || msgLower.includes('dsa') || msgLower.includes('experience')) {
      responseText = "Interview processes typically feature a coding round (DSA & system architecture) followed by 1-2 rounds of technical interviews and an HR fit round. Browse our Discussion Portal to read what companies like Amazon or Google asked seniors recently!";
    } else if (msgLower.includes('roadmap') || msgLower.includes('path') || msgLower.includes('frontend') || msgLower.includes('developer')) {
      responseText = "Under the Career Roadmaps tab, you can track progress on roles like Frontend Developer. Start with React, CSS layouts, and web optimization, then build 2-3 responsive projects to display in your profile.";
    }
    return { text: responseText };
  }
};

// ---------------- EXPORT RESOLUTION ----------------
export const api = isMockFallback() ? mockApi : {
  login: async (email, password) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.studentProfile) {
      localStorage.setItem('studentId', data.studentProfile.id || data.studentProfile._id);
    } else {
      localStorage.removeItem('studentId');
    }
    return data;
  },

  register: async (registerData) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData)
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.studentProfile) {
      localStorage.setItem('studentId', data.studentProfile.id || data.studentProfile._id);
    } else {
      localStorage.removeItem('studentId');
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('studentId');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getStudentProfile: () => {
    return apiRequest('/api/student/profile');
  },

  updateStudentProfile: (profileData) => {
    return apiRequest('/api/student/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  getStudents: () => {
    return apiRequest('/api/students');
  },

  verifyStudent: (id, verified) => {
    return apiRequest(`/api/students/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ verified })
    });
  },

  getCompanies: () => {
    return apiRequest('/api/companies');
  },

  addCompany: (companyData) => {
    return apiRequest('/api/companies', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  },

  getJobs: () => {
    return apiRequest('/api/jobs');
  },

  addJob: (jobData) => {
    return apiRequest('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  getApplications: () => {
    return apiRequest('/api/applications');
  },

  applyForJob: (jobId) => {
    return apiRequest('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId })
    });
  },

  updateApplicationStage: (appId, stage) => {
    return apiRequest(`/api/applications/${appId}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage })
    });
  },

  getDiscussions: () => {
    return apiRequest('/api/discussions');
  },

  addDiscussionPost: (postData) => {
    return apiRequest('/api/discussions', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  getResumes: () => {
    return apiRequest('/api/resumes');
  },

  addResume: (name) => {
    return apiRequest('/api/resumes', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },

  deleteResume: (id) => {
    return apiRequest(`/api/resumes/${id}`, {
      method: 'DELETE'
    });
  },

  setPrimaryResume: (id) => {
    return apiRequest(`/api/resumes/${id}/primary`, {
      method: 'PUT'
    });
  },

  getNotifications: () => {
    return apiRequest('/api/notifications');
  },

  markNotificationRead: (id) => {
    return apiRequest(`/api/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  sendAiChatMessage: (message, cgpa) => {
    return apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, cgpa })
    });
  }
};
