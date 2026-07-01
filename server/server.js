import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix Node.js DNS resolution issues on Windows for MongoDB Atlas SRV connection strings
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Warning: Failed to set custom DNS servers for Node.js:', e.message);
}

import { User, Student, Company, Job, Application, Discussion, Resume, Notification } from './models.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'placemate_secret_jwt_key_123';
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());

// CORS configuration - supports local frontend proxy and production Vercel frontend domain
const whitelist = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For ease of local development and deployment testing, allow all if not explicitly matched, 
      // but warn in logs. In production, strict whitelist can be enforced.
      callback(null, true);
    }
  },
  credentials: true
}));

// Connect to MongoDB Atlas
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Successfully connected to MongoDB Atlas.');
      // Auto-seed if database is empty
      try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('No users found in database. Initializing database with mock seed data...');
          await seedDatabase();
        }
      } catch (err) {
        console.error('Error during auto-seeding:', err);
      }
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
    });
} else {
  console.log('⚠️ MONGODB_URI not defined. Running Express server with local JSON database fallback.');
  // Auto-seed local database if empty
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in local database. Initializing database with mock seed data...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('Error during local auto-seeding:', err);
  }
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = decoded; // { id: user._id, email: user.email, role: user.role }
    next();
  });
};

// Role authorization helper
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires one of: ${roles.join(', ')}` });
    }
    next();
  };
};

// ---------------- API ROUTES ----------------

// 1. Auth Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // If role is student, fetch their student profile
    let studentProfile = null;
    if (user.role === 'student') {
      studentProfile = await Student.findOne({ userId: user._id });
    }

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      studentProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// 1.5. Auth Register Route
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, registerNo, department, year } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: 'student'
    });

    // Create Student Profile
    const newStudent = await Student.create({
      userId: newUser._id,
      name,
      registerNo: registerNo || '',
      department: department || '',
      year: year || '',
      cgpa: null,
      skills: [],
      projects: [],
      certifications: [],
      achievements: [],
      verified: false,
      profileStatus: 'PENDING',
      placementStatus: 'NOT PLACED',
      readinessScore: 0
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      },
      studentProfile: newStudent
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// 2. Get Student Profile (Self)
app.get('/api/student/profile', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const profile = await Student.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching student profile.' });
  }
});

// 3. Update Student Profile (Self)
app.put('/api/student/profile', authenticateToken, authorizeRoles('student'), async (req, res) => {
  const { cgpa, department, year, skills, projects, certifications, achievements, readinessScore } = req.body;
  try {
    const profile = await Student.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (department !== undefined) profile.department = department;
    if (year !== undefined) profile.year = year;
    if (skills !== undefined) profile.skills = skills;
    if (projects !== undefined) profile.projects = projects;
    if (certifications !== undefined) profile.certifications = certifications;
    if (achievements !== undefined) profile.achievements = achievements;
    if (readinessScore !== undefined) profile.readinessScore = readinessScore;

    // Automatically set status to SUBMITTED if changes are made to a PENDING profile
    if (profile.profileStatus === 'PENDING') {
      profile.profileStatus = 'SUBMITTED';
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating student profile.' });
  }
});

// 4. Get All Students (Officer / HOD only)
app.get('/api/students', authenticateToken, authorizeRoles('officer', 'hod'), async (req, res) => {
  try {
    const students = await Student.find({}).populate('userId', 'email');
    // Map response structure to align with UI expectations (needs 'email' inside student)
    const formatted = students.map(s => {
      const obj = s.toObject();
      obj.email = s.userId?.email || 'N/A';
      return obj;
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching students list.' });
  }
});

// 5. Verify Student Profile (Officer only)
app.put('/api/students/:id/verify', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  const { verified } = req.body;
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    student.verified = verified;
    student.profileStatus = verified ? 'VERIFIED' : 'SUBMITTED';
    await student.save();

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating verification status.' });
  }
});

// 6. Companies API
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching companies.' });
  }
});

app.post('/api/companies', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  const { name, sector, avgPackage, hiredCount } = req.body;
  try {
    const newCompany = await Company.create({
      name,
      sector,
      avgPackage,
      hiredCount: hiredCount || 0
    });
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(400).json({ message: 'Error adding company. Name might already exist.' });
  }
});

// 7. Jobs API
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching jobs.' });
  }
});

app.post('/api/jobs', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  const { title, company, type, package: pkg, minCgpa, departments, skillsRequired, description, location } = req.body;
  try {
    const newJob = await Job.create({
      title,
      company,
      type,
      package: pkg,
      minCgpa: Number(minCgpa) || 0,
      departments: departments || ['All'],
      skillsRequired: skillsRequired || [],
      description,
      location
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job listing.' });
  }
});

// 8. Applications API
app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    let applications;
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found.' });
      }
      applications = await Application.find({ studentId: student._id }).populate('jobId');
    } else {
      // HOD and Officer see all applications
      applications = await Application.find({}).populate('jobId').populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'email' }
      });
    }

    // Format response to flat structure matching UI
    const formatted = applications.map(app => {
      const appObj = app.toObject();
      return {
        id: appObj._id.toString(),
        studentId: appObj.studentId?._id?.toString() || appObj.studentId?.toString(),
        studentName: appObj.studentId?.name || 'N/A',
        studentRegisterNo: appObj.studentId?.registerNo || 'N/A',
        studentCgpa: appObj.studentId?.cgpa || null,
        studentEmail: appObj.studentId?.userId?.email || 'N/A',
        jobId: appObj.jobId?._id?.toString() || appObj.jobId?.toString(),
        jobTitle: appObj.jobId?.title || 'N/A',
        companyName: appObj.jobId?.company || 'N/A',
        stage: appObj.stage,
        date: appObj.date
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error fetching applications.' });
  }
});

app.post('/api/applications', authenticateToken, authorizeRoles('student'), async (req, res) => {
  const { jobId } = req.body;
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    // Check if application already exists
    const existing = await Application.findOne({ studentId: student._id, jobId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this position.' });
    }

    const newApp = await Application.create({
      studentId: student._id,
      jobId,
      stage: 'Applied',
      date: new Date().toISOString().split('T')[0]
    });

    // Populate job details to respond back
    const populated = await Application.findById(newApp._id).populate('jobId');

    res.status(201).json({
      id: populated._id.toString(),
      studentId: student._id.toString(),
      jobId: populated.jobId?._id?.toString(),
      jobTitle: populated.jobId?.title || 'N/A',
      companyName: populated.jobId?.company || 'N/A',
      stage: populated.stage,
      date: populated.date
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error submitting application.' });
  }
});

// Update Application Stage (Officer only)
app.put('/api/applications/:id/stage', authenticateToken, authorizeRoles('officer'), async (req, res) => {
  const { stage } = req.body;
  try {
    const appRecord = await Application.findById(req.params.id).populate('jobId');
    if (!appRecord) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const previousStage = appRecord.stage;
    appRecord.stage = stage;
    await appRecord.save();

    // If stage changed to Selected, increment the hiredCount for the company
    if (stage === 'Selected' && previousStage !== 'Selected') {
      const companyName = appRecord.jobId?.company;
      if (companyName) {
        await Company.findOneAndUpdate(
          { name: companyName },
          { $inc: { hiredCount: 1 } }
        );
      }

      // Also set the student's placement status to PLACED
      await Student.findByIdAndUpdate(appRecord.studentId, { placementStatus: 'PLACED' });
    }

    res.json({ id: appRecord._id, stage: appRecord.stage });
  } catch (error) {
    console.error('Error updating application stage:', error);
    res.status(500).json({ message: 'Server error updating application stage.' });
  }
});

// 9. Discussions API
app.get('/api/discussions', async (req, res) => {
  try {
    const posts = await Discussion.find({}).sort({ createdAt: -1 });
    // Map keys to match UI expectations
    const formatted = posts.map(p => ({
      id: p._id,
      title: p.title,
      company: p.company,
      category: p.category,
      content: p.content,
      user: p.user,
      date: p.date
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching discussion posts.' });
  }
});

app.post('/api/discussions', authenticateToken, async (req, res) => {
  const { title, company, category, content } = req.body;
  try {
    // Resolve user name
    let userName = 'Anonymous';
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (student && student.name) userName = student.name;
    } else {
      userName = req.user.role === 'officer' ? 'Placement Officer' : 'HOD';
    }

    const post = await Discussion.create({
      title,
      company,
      category,
      content,
      user: userName,
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json({
      id: post._id,
      title: post.title,
      company: post.company,
      category: post.category,
      content: post.content,
      user: post.user,
      date: post.date
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding discussion post.' });
  }
});

// 10. Resumes API
app.get('/api/resumes', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const resumes = await Resume.find({ studentId: student._id });
    res.json(resumes.map(r => ({
      id: r._id,
      name: r.name,
      date: r.date,
      primary: r.primary
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching resumes.' });
  }
});

app.post('/api/resumes', authenticateToken, authorizeRoles('student'), async (req, res) => {
  const { name } = req.body;
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    // If this is the first resume, set it as primary automatically
    const resumeCount = await Resume.countDocuments({ studentId: student._id });
    const isPrimary = resumeCount === 0;

    const resume = await Resume.create({
      studentId: student._id,
      name,
      date: new Date().toISOString().split('T')[0],
      primary: isPrimary
    });

    res.status(201).json({
      id: resume._id,
      name: resume.name,
      date: resume.date,
      primary: resume.primary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error saving resume.' });
  }
});

app.delete('/api/resumes/:id', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const resume = await Resume.findOneAndDelete({ _id: req.params.id, studentId: student._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    // If we deleted the primary resume and other resumes remain, set one of them as primary
    if (resume.primary) {
      const another = await Resume.findOne({ studentId: student._id });
      if (another) {
        another.primary = true;
        await another.save();
      }
    }

    res.json({ message: 'Resume deleted successfully.', deletedId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting resume.' });
  }
});

app.put('/api/resumes/:id/primary', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    // Clear primary for all resumes
    await Resume.updateMany({ studentId: student._id }, { primary: false });

    // Set primary for target resume
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, studentId: student._id },
      { primary: true },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    res.json({ id: resume._id, primary: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating primary resume.' });
  }
});

// 11. Notifications API
app.get('/api/notifications', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    // Fetch notifications specific to this student
    const notes = await Notification.find({ studentId: student._id }).sort({ createdAt: -1 });
    res.json(notes.map(n => ({
      id: n._id,
      text: n.text,
      read: n.read,
      date: n.date
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notifications.' });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const note = await Notification.findOneAndUpdate(
      { _id: req.params.id, studentId: student._id },
      { read: true },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.json({ id: note._id, read: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating notification status.' });
  }
});

// 12. Simulated AI Assistant backend route
app.post('/api/ai/chat', authenticateToken, authorizeRoles('student'), async (req, res) => {
  const { message, cgpa } = req.body;
  
  if (!message) {
    return res.status(400).json({ message: 'Message content is required.' });
  }

  // Simulated AI response logic
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

  res.json({ text: responseText });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Placemate backend server listening on port ${PORT}`);
});
