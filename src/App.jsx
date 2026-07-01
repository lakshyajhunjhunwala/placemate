import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Briefcase, Users, Building, 
  MessageSquare, Compass, ShieldAlert, ShieldCheck, 
  Bell, Search, Globe, LogOut, ChevronRight, Menu,
  FileText, TrendingUp, CheckCircle, Award,
  Eye, EyeOff, ArrowRight, Rocket, Shield, Laptop, Code, X
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

  // Registration and UI states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerRegNo, setRegisterRegNo] = useState('');
  const [registerDepartment, setRegisterDepartment] = useState('Computer Science');
  const [registerYear, setRegisterYear] = useState('3rd Year');
  const [registerPassword, setRegisterPassword] = useState('');

  // Global States
  const [studentProfile, setStudentProfile] = useState({
    skills: [],
    projects: [],
    certifications: [],
    achievements: []
  });
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
      const profilePromise = userRole === 'student' 
        ? api.getStudentProfile().catch(e => { console.error("Error loading profile:", e); return {}; })
        : Promise.resolve({});
        
      const resumesPromise = userRole === 'student'
        ? api.getResumes().catch(e => { console.error("Error loading resumes:", e); return []; })
        : Promise.resolve([]);
        
      const notificationsPromise = userRole === 'student'
        ? api.getNotifications().catch(e => { console.error("Error loading notifications:", e); return []; })
        : Promise.resolve([]);
        
      const studentsPromise = userRole !== 'student'
        ? api.getStudents().catch(e => { console.error("Error loading students:", e); return []; })
        : Promise.resolve([]);

      const companiesPromise = api.getCompanies().catch(e => { console.error("Error loading companies:", e); return []; });
      const jobsPromise = api.getJobs().catch(e => { console.error("Error loading jobs:", e); return []; });
      const applicationsPromise = api.getApplications().catch(e => { console.error("Error loading applications:", e); return []; });
      const discussionsPromise = api.getDiscussions().catch(e => { console.error("Error loading discussions:", e); return []; });

      const [
        profile,
        resList,
        noteList,
        studsList,
        compList,
        jobList,
        appList,
        discList
      ] = await Promise.all([
        profilePromise,
        resumesPromise,
        notificationsPromise,
        studentsPromise,
        companiesPromise,
        jobsPromise,
        applicationsPromise,
        discussionsPromise
      ]);

      if (userRole === 'student') {
        const p = profile || {};
        setStudentProfile({
          ...p,
          skills: p.skills || [],
          projects: p.projects || [],
          certifications: p.certifications || [],
          achievements: p.achievements || []
        });
        setResumes(resList || []);
        setNotifications(noteList || []);
      } else {
        setStudents(studsList || []);
      }
      setCompanies(compList || []);
      setJobs(jobList || []);
      setApplications(appList || []);
      setDiscussions(discList || []);
    } catch (err) {
      console.error("Error loading data in parallel:", err);
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!registerName || !registerEmail || !registerPassword) {
      setLoginError('Name, email, and password are required.');
      return;
    }
    try {
      setIsLoading(true);
      const data = await api.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        registerNo: registerRegNo,
        department: registerDepartment,
        year: registerYear
      });
      setRole('student');
      setIsLoggedIn(true);
      setActiveSubTab('overview');
      await loadData('student');
      
      // Clear fields
      setRegisterName('');
      setRegisterEmail('');
      setRegisterRegNo('');
      setRegisterPassword('');
      setIsRegisterMode(false);
    } catch (err) {
      setLoginError(err.message || 'Registration failed.');
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
    if (showLoginModal) {
      return (
        <div className="split-container" style={{ fontFamily: 'var(--font-sans)' }}>
          {/* Left Side: Dark Grid Panel */}
          <div className="left-panel login-grid-bg">
            {/* Header Branding */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#2563eb', padding: '6px', borderRadius: '8px', color: 'white' }}>
                <GraduationCap size={22} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Placemate</span>
            </div>

            {/* Middle Typography */}
            <div style={{ margin: 'auto 0' }}>
              <h1 className="font-serif" style={{ fontSize: '2.8rem', fontWeight: 500, lineHeight: 1.15, color: '#f8fafc', marginBottom: '20px' }}>
                Your placement <br/>
                <span style={{ fontStyle: 'italic', color: '#93c5fd' }}>journey starts</span> <br/>
                <span style={{ color: '#10b981' }}>right here.</span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, maxWidth: '440px', fontWeight: 400 }}>
                Placemate is a full-stack placement management system — connecting students, faculty, and officers in one unified platform.
              </p>
            </div>

            {/* Bottom Portal Switchers */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { key: 'student', label: 'Student Portal', color: '#2563eb' },
                  { key: 'hod', label: 'Faculty Portal', color: '#a855f7' },
                  { key: 'officer', label: 'Officer Portal', color: '#10b981' }
                ].map(p => {
                  const isActive = loginRole === p.key;
                  return (
                    <div 
                      key={p.key}
                      onClick={() => {
                        if (!isRegisterMode) {
                          handleRoleTabChange(p.key);
                        } else {
                          setIsRegisterMode(false);
                          handleRoleTabChange(p.key);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                        border: isActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        width: 'fit-content'
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color }}></div>
                      <span style={{ color: isActive ? '#ffffff' : '#94a3b8', fontSize: '0.9rem', fontWeight: isActive ? 600 : 500 }}>
                        {p.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Cream Form Panel */}
          <div className="right-panel">
            <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
              {/* Back to Home Link */}
              <button 
                onClick={() => setShowLoginModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4b5563',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '28px',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = '#111827'}
                onMouseOut={(e) => e.target.style.color = '#4b5563'}
              >
                ← Back to home
              </button>

              {/* Header */}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', color: '#9ca3af', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                PLACEMENT PORTAL
              </span>
              <h2 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 500, color: '#111827', marginBottom: '8px' }}>
                {isRegisterMode ? 'Activate account' : 'Welcome back'}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '32px' }}>
                {isRegisterMode 
                  ? 'Activate your student credentials to log in.' 
                  : `Sign in to continue to your ${loginRole === 'hod' ? 'faculty' : loginRole} portal.`
                }
              </p>

              {loginError && (
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>
                  {loginError}
                </div>
              )}

              {!isRegisterMode ? (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      placeholder="name@placemate.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: 'white',
                        color: '#1f2937',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '8px' }}>
                      PASSWORD
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 48px 12px 16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: 'white',
                          color: '#1f2937',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#111827',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s',
                      marginTop: '8px',
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
                  </button>

                  {loginRole === 'student' && (
                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>First time? </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegisterMode(true);
                          setLoginError('');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          padding: '0 4px',
                          textDecoration: 'underline'
                        }}
                      >
                        Activate your account ➔
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: 'white',
                        color: '#1f2937',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        placeholder="john@gmail.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: 'white',
                          color: '#1f2937',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        REGISTER NUMBER
                      </label>
                      <input
                        type="text"
                        placeholder="21BCE0123"
                        value={registerRegNo}
                        onChange={(e) => setRegisterRegNo(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: 'white',
                          color: '#1f2937',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        DEPARTMENT
                      </label>
                      <select
                        value={registerDepartment}
                        onChange={(e) => setRegisterDepartment(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: 'white',
                          color: '#1f2937',
                          fontSize: '0.9rem',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics & Communication">Electronics & Comm</option>
                        <option value="Mechanical Engineering">Mechanical Eng</option>
                        <option value="Civil Engineering">Civil Eng</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        ACADEMIC YEAR
                      </label>
                      <select
                        value={registerYear}
                        onChange={(e) => setRegisterYear(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: 'white',
                          color: '#1f2937',
                          fontSize: '0.9rem',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                      PASSWORD
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 48px 10px 14px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: 'white',
                          color: '#1f2937',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: '#111827',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s',
                      marginTop: '8px',
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? 'Activating...' : 'Activate Account'} <ArrowRight size={18} />
                  </button>

                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Already activated? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(false);
                        setLoginError('');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        padding: '0 4px',
                        textDecoration: 'underline'
                      }}
                    >
                      Sign In ➔
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Demo Info */}
              {!isRegisterMode && (
                <div style={{ marginTop: '32px', padding: '14px 16px', background: '#fdfbf7', border: '1px solid #f3f0e8', borderRadius: '8px', fontSize: '0.8rem', color: '#6b7280', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1rem', lineHeight: '1' }}>💡</span>
                  <div>
                    <strong>Demo Mode</strong>: Credentials auto-fill on selection. Click <strong>Sign In</strong> to proceed.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    const scrollToFeatures = () => {
      const el = document.getElementById('features-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <div style={{ backgroundColor: '#0b0f19', color: '#f8fafc', minHeight: '100vh', width: '100vw', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
        {/* HERO SECTION */}
        <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '40px 20px', justifyContent: 'space-between' }} className="login-grid-bg">
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', width: '100%', margin: '0 auto', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#2563eb', padding: '6px', borderRadius: '8px', color: 'white' }}>
                <GraduationCap size={22} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>Placemate</span>
            </div>
            <button 
              onClick={() => { setIsRegisterMode(false); setShowLoginModal(true); }}
              style={{
                background: '#ffffff', color: '#0b0f19', padding: '8px 20px', borderRadius: '20px', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
              }}
            >
              Sign In
            </button>
          </div>

          {/* Hero Content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px', width: '100%', margin: 'auto', zIndex: 10, padding: '40px 0' }}>
            <div className="landing-badge" style={{ marginBottom: '24px' }}>
              <div className="dot"></div>
              <span>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</span>
            </div>
            <h1 className="landing-hero-title">
              Campus Placement <br />
              <span className="text-emerald-gradient">Reimagined.</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '640px', margin: '24px 0 36px 0', fontWeight: 400 }}>
              Havloc is a full-stack placement management system built for SRM — connecting students, faculty, and placement officers in one unified platform.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                onClick={() => { setIsRegisterMode(false); setShowLoginModal(true); }}
                style={{
                  background: '#ffffff', color: '#0b0f19', padding: '14px 28px', borderRadius: '24px', border: 'none', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(255,255,255,0.15)'
                }}
              >
                <ArrowRight size={18} /> Enter Portal
              </button>
              <button 
                onClick={scrollToFeatures}
                style={{
                  background: 'rgba(255,255,255,0.04)', color: '#94a3b8', padding: '14px 28px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'
                }}
              >
                Explore Features v
              </button>
            </div>
          </div>
          <div></div>
        </section>

        {/* ABOUT SECTION (Cream/Beige Panel) */}
        <section style={{ backgroundColor: '#faf8f5', color: '#111827', padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* About Navigation Overview Bar */}
            <div className="about-nav-container">
              {['PLACEMENT RECORDS', 'STUDENT PORTAL', 'COMPANY MANAGEMENT', 'FACULTY OVERSIGHT', 'ROUND TRACKER', 'ANALYTICS', 'REST API', 'ROLE-BASED'].map((item, idx) => (
                <span key={idx} className={`about-nav-link ${idx === 1 ? 'active' : ''}`}>{item}</span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
              {/* Left Column: Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: '#10b981', textTransform: 'uppercase' }}>ABOUT THE PROJECT</span>
                <h2 className="font-serif" style={{ fontSize: '2.8rem', fontWeight: 500, lineHeight: 1.15, color: '#111827' }}>
                  One platform for the <br />entire placement <br />lifecycle
                </h2>
                <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: 1.6 }}>
                  Havloc (Highly Automated Virtual Liaison for Opportunities and Campus) was developed as a B.Tech DBMS project at SRM Institute of Science and Technology to solve the fragmented, manual processes in campus placement.
                </p>
                <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: 1.6 }}>
                  From job listings and student applications to round-by-round tracking and placement analytics — everything is centralized, real-time, and role-aware.
                </p>
                <div style={{ marginTop: '12px' }}>
                  {['React.js', 'Node.js', 'MongoDB', 'REST API', 'Vanilla CSS'].map((tag, idx) => (
                    <span key={idx} className="about-tech-tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Right Column: Outline Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="outline-card">
                  <div className="outline-card-icon" style={{ color: '#2563eb' }}>
                    <Rocket size={20} />
                  </div>
                  <h3 className="outline-card-title">Built from scratch</h3>
                  <p className="outline-card-desc">No templates used. Crafted carefully for high performance and clean structures.</p>
                </div>

                <div className="outline-card">
                  <div className="outline-card-icon" style={{ color: '#10b981' }}>
                    <Laptop size={20} />
                  </div>
                  <h3 className="outline-card-title">Fully Responsive</h3>
                  <p className="outline-card-desc">Beautifully adaptable from mobile smartphones to ultra-wide monitors.</p>
                </div>

                <div className="outline-card">
                  <div className="outline-card-icon" style={{ color: '#a855f7' }}>
                    <Shield size={20} />
                  </div>
                  <h3 className="outline-card-title">JWT Auth</h3>
                  <p className="outline-card-desc">Robust security framework delivering secure, role-based dashboard control.</p>
                </div>

                <div className="outline-card">
                  <div className="outline-card-icon" style={{ color: '#ec4899' }}>
                    <Code size={20} />
                  </div>
                  <h3 className="outline-card-title">API-First</h3>
                  <p className="outline-card-desc">Developed with clean, well-documented REST APIs for perfect modular integration.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features-section" style={{ backgroundColor: '#ffffff', color: '#111827', padding: '80px 24px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: '#10b981', textTransform: 'uppercase' }}>FEATURES</span>
            <h2 className="font-serif" style={{ fontSize: '2.8rem', fontWeight: 500, color: '#111827', marginTop: '12px', marginBottom: '48px' }}>
              Everything placement <span style={{ fontStyle: 'italic', color: '#10b981' }}>needs.</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {[
                { title: 'Student Portal', desc: 'Students can browse opportunities, apply to jobs, track application rounds, and manage their profile all in one place.', icon: <GraduationCap size={20} />, color: '#2563eb' },
                { title: 'Company Management', desc: 'Placement officers can onboard companies, post job listings, and manage the full recruitment pipeline.', icon: <Building size={20} />, color: '#10b981' },
                { title: 'Faculty Oversight', desc: 'Faculty and HODs get real-time visibility into student placement progress and department statistics.', icon: <Users size={20} />, color: '#a855f7' },
                { title: 'Analytics & Reports', desc: 'Detailed placement analytics, internship ratios, CTC breakdowns, and exportable reports for stakeholders.', icon: <TrendingUp size={20} />, color: '#3b82f6' },
                { title: 'Round Tracking', desc: 'Track every interview round — aptitude, technical, HR — with live status updates for each student.', icon: <CheckCircle size={20} />, color: '#f59e0b' },
                { title: 'Role-Based Access', desc: 'Separate secure portals for students, faculty, and placement officers with role-specific dashboards.', icon: <Shield size={20} />, color: '#ec4899' }
              ].map((feat, idx) => (
                <div key={idx} className="feature-card">
                  <div style={{ display: 'flex', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.02)', color: feat.color, alignItems: 'center', justifyContent: 'center' }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>{feat.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STAKEHOLDERS LOGIN SECTION */}
        <section style={{ backgroundColor: '#0b0f19', color: '#ffffff', padding: '80px 24px', position: 'relative' }} className="login-grid-bg">
          <div style={{ maxWidth: '1200px', margin: '0 auto', zIndex: 10, position: 'relative' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', color: '#10b981', textTransform: 'uppercase', display: 'block', textAlign: 'center', marginBottom: '12px' }}>
              THREE PORTALS
            </span>
            <h2 className="font-serif" style={{ fontSize: '2.8rem', fontWeight: 500, textAlign: 'center', marginBottom: '48px', color: '#ffffff' }}>
              One system, every <span style={{ fontStyle: 'italic', color: '#10b981' }}>stakeholder.</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', maxWidth: '960px', margin: '0 auto' }}>
              {[
                { role: 'student', title: 'Student', desc: 'Apply, track rounds, manage profile', color: '#2563eb', hoverClass: 'active-student', icon: <GraduationCap size={24} /> },
                { role: 'hod', title: 'Faculty / HOD', desc: 'Monitor students, view reports', color: '#a855f7', hoverClass: 'active-faculty', icon: <Users size={24} /> },
                { role: 'officer', title: 'Placement Officer', desc: 'Manage companies, jobs, placements', color: '#10b981', hoverClass: 'active-officer', icon: <Building size={24} /> }
              ].map((p, idx) => (
                <div key={idx} className={`stakeholder-card ${p.hoverClass}`}>
                  <div style={{ display: 'flex', width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', color: p.color, alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    {p.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '8px' }}>{p.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.4, marginBottom: '24px' }}>{p.desc}</p>
                  <button 
                    onClick={() => {
                      setLoginRole(p.role);
                      setEmail(CREDENTIALS[p.role].email);
                      setPassword(CREDENTIALS[p.role].password);
                      setIsRegisterMode(false);
                      setLoginError('');
                      setShowLoginModal(true);
                    }}
                    style={{
                      background: 'none', border: 'none', color: p.color, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.5px'
                    }}
                  >
                    LOGIN ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM FOOTER SECTION */}
        <footer style={{ backgroundColor: '#faf8f5', color: '#4b5563', padding: '60px 24px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', color: '#10b981', textTransform: 'uppercase' }}>THE TEAM</span>
            <h2 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 500, color: '#111827' }}>
              Built by students, <br /><span style={{ fontStyle: 'italic', color: '#10b981' }}>for students.</span>
            </h2>
            <div style={{ borderTop: '1px solid #e5e7eb', width: '100%', paddingTop: '20px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>
              <span>© {new Date().getFullYear()} Placemate Ecosystem. All rights reserved.</span>
              <span>Centralized Career & Placement System</span>
            </div>
          </div>
        </footer>
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
