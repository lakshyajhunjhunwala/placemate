import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Briefcase, Users, Building, 
  MessageSquare, Compass, ShieldAlert, ShieldCheck, 
  Bell, Search, Globe, LogOut, ChevronRight, Menu,
  FileText, TrendingUp, CheckCircle, Award
} from 'lucide-react';
import StudentDashboard from './components/StudentDashboard';
import OfficerDashboard from './components/OfficerDashboard';
import HODDashboard from './components/HODDashboard';
import { api } from './api';

// Mock Data Definitions
const INITIAL_STUDENT_PROFILE = {
  id: 'stud-1',
  name: 'Rahul Sharma',
  email: 'rahul@gmail.com',
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
};

const INITIAL_STUDENTS_LIST = [
  INITIAL_STUDENT_PROFILE,
  {
    id: 'stud-2',
    name: 'Not set',
    email: 'newstudent@email.com',
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
    id: 'stud-3',
    name: 'Not set',
    email: 'newstudent201@email.com',
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
    id: 'stud-4',
    name: 'Not set',
    email: 'newstudent202@email.com',
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
    id: 'stud-5',
    name: 'Not set',
    email: 'newstudent203@email.com',
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
    id: 'stud-6',
    name: 'Justin Juby',
    email: 'justin@gmail.com',
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
    id: 'stud-7',
    name: 'Tuvva Abhilash Reddy',
    email: 'newstudent205@email.com',
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

const INITIAL_COMPANIES = [
  { id: 'comp-1', name: 'Google', sector: 'Technology', avgPackage: '25 LPA', hiredCount: 3 },
  { id: 'comp-2', name: 'Amazon', sector: 'E-Commerce & Cloud', avgPackage: '18 LPA', hiredCount: 5 },
  { id: 'comp-3', name: 'Microsoft', sector: 'Technology', avgPackage: '20 LPA', hiredCount: 4 },
  { id: 'comp-4', name: 'TCS', sector: 'Consulting', avgPackage: '4.5 LPA', hiredCount: 15 },
  { id: 'comp-5', name: 'Deloitte', sector: 'Finance & Advisory', avgPackage: '8 LPA', hiredCount: 8 }
];

const INITIAL_JOBS = [
  { 
    id: 'job-1', 
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
    id: 'job-2', 
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
    id: 'job-3', 
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
    id: 'job-4', 
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
    id: 'job-5', 
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

const INITIAL_APPLICATIONS = [
  { id: 'app-1', studentId: 'stud-1', jobId: 'job-3', stage: 'Selected', date: '2026-06-12' },
  { id: 'app-2', studentId: 'stud-6', jobId: 'job-1', stage: 'Selected', date: '2026-06-10' },
  { id: 'app-3', studentId: 'stud-7', jobId: 'job-1', stage: 'Selected', date: '2026-06-14' }
];

const INITIAL_DISCUSSIONS = [
  {
    id: 'disc-1',
    title: 'Google Coding Round Experience (CSE)',
    company: 'Google',
    category: 'Interview Experience',
    content: 'Completed the online assessment. First question was lowest common ancestor in a Binary Search Tree (BST). Second was a variation of 0/1 knapsack with multiple weight dimensions. Focus heavily on Trees & DP problems in Leetcode.',
    user: 'Priya Sharma',
    date: '2026-06-10'
  },
  {
    id: 'disc-2',
    title: 'Deloitte Tech & HR Round Walkthrough',
    company: 'Deloitte',
    category: 'Interview Experience',
    content: 'First round was aptitude. Second round was technical, focusing on SQL join queries, relational design, and basics of OOPs. HR round focused on behavioral questions like resolving team conflicts.',
    user: 'Sneha Patel',
    date: '2026-06-13'
  }
];

const CREDENTIALS = {
  student: { email: 'rahul@gmail.com', password: 'rahul123' },
  officer: { email: 'officer@placemate.com', password: 'officer123' },
  hod: { email: 'hod@placemate.com', password: 'hod123' }
};

export default function App() {
  const [role, setRole] = useState('student'); // student, officer, hod
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginRole, setLoginRole] = useState('student');
  const [email, setEmail] = useState(CREDENTIALS.student.email);
  const [password, setPassword] = useState(CREDENTIALS.student.password);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Global States
  const [studentProfile, setStudentProfile] = useState({});
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadData = async (userRole) => {
    try {
      if (userRole === 'student') {
        const profile = await api.getStudentProfile();
        setStudentProfile(profile);
        
        const resList = await api.getResumes();
        setResumes(resList);
        
        const noteList = await api.getNotifications();
        setNotifications(noteList);
      } else {
        const studsList = await api.getStudents();
        setStudents(studsList);
      }
      
      const compList = await api.getCompanies();
      setCompanies(compList);
      
      const jobList = await api.getJobs();
      setJobs(jobList);
      
      const appList = await api.getApplications();
      setApplications(appList);
      
      const discList = await api.getDiscussions();
      setDiscussions(discList);
    } catch (err) {
      console.error("Error loading data from API:", err);
    }
  };

  useEffect(() => {
    const token = api.getToken();
    const user = api.getCurrentUser();
    if (token && user) {
      setRole(user.role);
      setIsLoggedIn(true);
      setIsLoading(true);
      loadData(user.role).finally(() => setIsLoading(false));
    }
  }, []);

  const handleRoleTabChange = (selectedRole) => {
    setLoginRole(selectedRole);
    setEmail(CREDENTIALS[selectedRole].email);
    setPassword(CREDENTIALS[selectedRole].password);
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      setIsLoading(true);
      const data = await api.login(email, password);
      setRole(data.user.role);
      setIsLoggedIn(true);
      setActiveSubTab('overview');
      await loadData(data.user.role);
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setStudentProfile({});
    setStudents([]);
    setCompanies([]);
    setJobs([]);
    setApplications([]);
    setDiscussions([]);
    setResumes([]);
    setNotifications([]);
  };

  // State mutators shared across views
  const applyForJob = async (jobId) => {
    try {
      const newApp = await api.applyForJob(jobId);
      setApplications(prev => [...prev, newApp]);
    } catch (err) {
      alert(err.message || "Failed to apply for job.");
    }
  };

  const updateStudentProfile = async (updatedFields) => {
    try {
      const updated = await api.updateStudentProfile(updatedFields);
      setStudentProfile(updated);
      setStudents(prev => prev.map(s => s.id === updated.id ? { ...s, ...updatedFields } : s));
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    }
  };

  const verifyStudent = async (studentId, isVerified) => {
    try {
      const updatedStudent = await api.verifyStudent(studentId, isVerified);
      setStudents(prev => prev.map(s => s.id === studentId ? { 
        ...s, 
        verified: isVerified,
        profileStatus: isVerified ? 'VERIFIED' : 'SUBMITTED'
      } : s));
      if (studentProfile && studentProfile.id === studentId) {
        setStudentProfile(prev => ({ 
          ...prev, 
          verified: isVerified,
          profileStatus: isVerified ? 'VERIFIED' : 'SUBMITTED'
        }));
      }
    } catch (err) {
      alert(err.message || "Failed to verify student.");
    }
  };

  const addCompany = async (companyData) => {
    try {
      const newCompany = await api.addCompany(companyData);
      setCompanies(prev => [...prev, newCompany]);
    } catch (err) {
      alert(err.message || "Failed to add company.");
    }
  };

  const addJob = async (jobData) => {
    try {
      const newJob = await api.addJob(jobData);
      setJobs(prev => [...prev, newJob]);
    } catch (err) {
      alert(err.message || "Failed to add job.");
    }
  };

  const updateApplicationStage = async (appId, stage) => {
    try {
      await api.updateApplicationStage(appId, stage);
      setApplications(prevApps => prevApps.map(app => {
        if (app.id === appId) {
          if (stage === 'Selected' && app.stage !== 'Selected') {
            const targetJob = jobs.find(j => j.id === app.jobId);
            if (targetJob) {
              setCompanies(prevComps => prevComps.map(c => 
                c.name === targetJob.company ? { ...c, hiredCount: c.hiredCount + 1 } : c
              ));
            }
          }
          return { ...app, stage };
        }
        return app;
      }));
    } catch (err) {
      alert(err.message || "Failed to update application stage.");
    }
  };

  const addDiscussionPost = async (post) => {
    try {
      const newPost = await api.addDiscussionPost(post);
      setDiscussions(prev => [newPost, ...prev]);
    } catch (err) {
      alert(err.message || "Failed to add discussion post.");
    }
  };

  const addResume = async (resume) => {
    try {
      const newResume = await api.addResume(resume.name);
      setResumes(prev => [...prev, newResume]);
    } catch (err) {
      alert(err.message || "Failed to add resume.");
    }
  };

  const deleteResume = async (resId) => {
    try {
      await api.deleteResume(resId);
      const resList = await api.getResumes();
      setResumes(resList);
    } catch (err) {
      alert(err.message || "Failed to delete resume.");
    }
  };

  const setPrimaryResume = async (resId) => {
    try {
      await api.setPrimaryResume(resId);
      setResumes(prev => prev.map(r => ({ ...r, primary: r.id === resId })));
    } catch (err) {
      alert(err.message || "Failed to set primary resume.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        background: 'radial-gradient(circle at center, hsl(240 10% 12%) 0%, hsl(var(--background)) 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow Effects in Background */}
        <div style={{ 
          position: 'absolute', top: '20%', left: '25%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(0,0,0,0) 70%)', zIndex: 1 
        }}></div>
        <div style={{ 
          position: 'absolute', bottom: '20%', right: '25%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(0,0,0,0) 70%)', zIndex: 1 
        }}></div>

        <div className="glass-card animate-fade-in" style={{ width: '480px', maxWidth: '100%', padding: '40px', zIndex: 2, position: 'relative' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'hsl(var(--primary))', padding: '8px', borderRadius: '10px', color: 'white' }}>
              <GraduationCap size={28} />
            </div>
            <span className="text-gradient" style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Placemate</span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, textAlign: 'center', marginBottom: '8px', color: 'white' }}>Sign in to Ecosystem</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', textAlign: 'center', marginBottom: '32px' }}>
            Access your Student, Placement Officer, or HOD dashboard.
          </p>

          {/* Role Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
            {['student', 'officer', 'hod'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleTabChange(r)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  background: loginRole === r ? 'hsl(var(--primary))' : 'transparent',
                  color: loginRole === r ? 'white' : 'hsl(var(--muted-foreground))',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease'
                }}
              >
                {r === 'officer' ? 'Officer' : r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loginError && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', textAlign: 'center' }}>
                {loginError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px', fontWeight: 500 }}>Email Address</label>
              <input
                type="email"
                placeholder="name@placemate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.25)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px', fontWeight: 500 }}>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.25)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px', fontSize: '0.95rem' }}
                required
              />
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '8px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)' }}
            >
              Sign In
            </button>
          </form>

          {/* Quick Demo Info */}
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', textAlign: 'center' }}>
            💡 Demo details are pre-filled automatically when you switch tabs above. Just click **Sign In** to log in instantly!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'hsl(var(--background))' }}>
      
      {/* Dynamic Sidebar */}
      <aside className="sidebar-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          {/* User Profile Widget */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', marginBottom: '10px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: '#10b981', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold', 
              fontSize: '1.2rem' 
            }}>
              {role === 'student' ? 'S' : role === 'officer' ? 'P' : 'H'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
                {role === 'student' ? 'student' : role === 'officer' ? 'po' : 'hod'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {role === 'student' ? 'Student' : role === 'officer' ? 'Placement Officer' : 'Head of Department'}
              </span>
            </div>
          </div>

          {/* Sidebar Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {role === 'student' && (
              <>
                <div className={`nav-link ${activeSubTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveSubTab('overview')}>
                  <Compass size={18} /> Dashboard
                </div>
                <div className={`nav-link ${activeSubTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveSubTab('profile')}>
                  <Users size={18} /> Academics & Profile
                </div>
                <div className={`nav-link ${activeSubTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveSubTab('jobs')}>
                  <Briefcase size={18} /> Jobs & Internships
                </div>
                <div className={`nav-link ${activeSubTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveSubTab('applications')}>
                  <ShieldCheck size={18} /> Application Tracker
                </div>
                <div className={`nav-link ${activeSubTab === 'roadmaps' ? 'active' : ''}`} onClick={() => setActiveSubTab('roadmaps')}>
                  <Compass size={18} /> Career Roadmaps
                </div>
                <div className={`nav-link ${activeSubTab === 'resume-vault' ? 'active' : ''}`} onClick={() => setActiveSubTab('resume-vault')}>
                  <FileText size={18} /> Resume Vault
                </div>
                <div className={`nav-link ${activeSubTab === 'discussions' ? 'active' : ''}`} onClick={() => setActiveSubTab('discussions')}>
                  <MessageSquare size={18} /> Discussion Portal
                </div>
                <div className={`nav-link ${activeSubTab === 'readiness-analyzer' ? 'active' : ''}`} onClick={() => setActiveSubTab('readiness-analyzer')}>
                  <TrendingUp size={18} /> Readiness Analyzer
                </div>
                <div className={`nav-link ${activeSubTab === 'ai-guidance' ? 'active' : ''}`} onClick={() => setActiveSubTab('ai-guidance')}>
                  <Compass size={18} /> AI Guidance
                </div>
              </>
            )}

            {role === 'officer' && (
              <>
                <div className={`nav-link ${activeSubTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveSubTab('overview')}>
                  <Compass size={18} /> Dashboard
                </div>
                <div className={`nav-link ${activeSubTab === 'students' ? 'active' : ''}`} onClick={() => setActiveSubTab('students')}>
                  <Users size={18} /> Students
                </div>
                <div className={`nav-link ${activeSubTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveSubTab('companies')}>
                  <Building size={18} /> Companies
                </div>
                <div className={`nav-link ${activeSubTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveSubTab('jobs')}>
                  <Briefcase size={18} /> Job Listings
                </div>
                <div className={`nav-link ${activeSubTab === 'internships' ? 'active' : ''}`} onClick={() => setActiveSubTab('internships')}>
                  <Award size={18} /> Internships
                </div>
                <div className={`nav-link ${activeSubTab === 'tracking' ? 'active' : ''}`} onClick={() => setActiveSubTab('tracking')}>
                  <ShieldCheck size={18} /> Applications
                </div>
                <div className={`nav-link ${activeSubTab === 'placements' ? 'active' : ''}`} onClick={() => setActiveSubTab('placements')}>
                  <CheckCircle size={18} /> Placements
                </div>
                <div className={`nav-link ${activeSubTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveSubTab('reports')}>
                  <TrendingUp size={18} /> Reports
                </div>
                <div className={`nav-link ${activeSubTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveSubTab('profile')}>
                  <Users size={18} /> My Profile
                </div>
                
                <div className="sidebar-header" style={{ marginTop: '16px', marginBottom: '8px' }}>SUPPORT</div>
                
                <div className={`nav-link ${activeSubTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveSubTab('settings')}>
                  <Compass size={18} /> Settings
                </div>
              </>
            )}

            {role === 'hod' && (
              <>
                <div className={`nav-link ${activeSubTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveSubTab('overview')}>
                  <Compass size={18} /> Dashboard
                </div>
                <div className={`nav-link ${activeSubTab === 'monitoring' ? 'active' : ''}`} onClick={() => setActiveSubTab('monitoring')}>
                  <Users size={18} /> Student Monitoring
                </div>
                <div className={`nav-link ${activeSubTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveSubTab('analytics')}>
                  <TrendingUp size={18} /> Analytics charts
                </div>
                <div className={`nav-link ${activeSubTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveSubTab('reports')}>
                  <FileText size={18} /> Strategic Reporting
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Logout Button */}
        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '12px', 
            width: '100%',
            border: 'none', 
            borderRadius: '24px',
            background: '#ffffff',
            color: '#1d4ed8',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            marginTop: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Content Panel */}
      <main style={{ flex: 1, padding: '24px 40px', overflowY: 'auto', maxHeight: '100vh' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: '16px' }}>
            <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderLeft: '4px solid hsl(var(--primary))', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
            <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.95rem' }}>Loading ecosystem data...</span>
          </div>
        ) : (
          <>
            {role === 'student' && (
              <StudentDashboard 
                student={studentProfile}
                jobs={jobs}
                applications={applications}
                applyForJob={applyForJob}
                updateProfile={updateStudentProfile}
                discussions={discussions}
                addDiscussionPost={addDiscussionPost}
                resumes={resumes}
                addResume={addResume}
                deleteResume={deleteResume}
                setPrimaryResume={setPrimaryResume}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
              />
            )}

            {role === 'officer' && (
              <OfficerDashboard 
                students={students}
                companies={companies}
                jobs={jobs}
                applications={applications}
                verifyStudent={verifyStudent}
                addCompany={addCompany}
                addJob={addJob}
                updateApplicationStage={updateApplicationStage}
                activeSubTab={activeSubTab}
                setActiveSubTab={setActiveSubTab}
              />
            )}

            {role === 'hod' && (
              <HODDashboard 
                students={students}
                companies={companies}
                jobs={jobs}
                applications={applications}
                activeSubTab={activeSubTab}
              />
            )}
          </>
        )}
      </main>

    </div>
  );
}
