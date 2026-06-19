import React, { useState } from 'react';
import { 
  User, Briefcase, FileText, CheckSquare, Award, BookOpen, 
  MessageSquare, Compass, ShieldAlert, ShieldCheck, Upload, 
  Trash2, Send, Search, CheckCircle, Clock, XCircle, ArrowUpRight,
  TrendingUp, Star, HelpCircle, GraduationCap
} from 'lucide-react';

export default function StudentDashboard({
  student,
  jobs,
  applications,
  applyForJob,
  updateProfile,
  discussions,
  addDiscussionPost,
  resumes,
  addResume,
  deleteResume,
  setPrimaryResume,
  activeSubTab,
  setActiveSubTab
}) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    cgpa: student.cgpa,
    department: student.department,
    year: student.year,
    newSkill: '',
    newProject: '',
    newCert: '',
    newAchievement: ''
  });

  // Job Search State
  const [jobSearch, setJobSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('all'); // all, jobs, internships, eligible
  const [selectedJob, setSelectedJob] = useState(null);

  // Discussion state
  const [newTopic, setNewTopic] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newContent, setNewContent] = useState('');
  const [discussionType, setDiscussionType] = useState('Interview Experience');

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your Placemate AI Assistant. Ask me anything about resumes, interview tips, CGPA requirements, or career roadmaps!' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Readiness Analyzer state
  const [analyzerScore, setAnalyzerScore] = useState(student.readinessScore);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({
    dsa: '',
    projects: '',
    resume: '',
    interviews: ''
  });

  // Roadmap State (Simulated checkboxes)
  const [roadmapProgress, setRoadmapProgress] = useState({
    'HTML/CSS Basics': true,
    'JavaScript Core': true,
    'React Fundamentals': true,
    'Node.js & Express': false,
    'Database Design (SQL/NoSQL)': false,
    'System Design Basics': false,
    'DSA Mock Questions': false
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({
      cgpa: parseFloat(profileForm.cgpa) || 0,
      department: profileForm.department,
      year: profileForm.year
    });
    setEditingProfile(false);
  };

  const handleAddListItem = (field, listKey) => {
    if (!profileForm[field].trim()) return;
    const updatedList = [...student[listKey], profileForm[field].trim()];
    updateProfile({ [listKey]: updatedList });
    setProfileForm({ ...profileForm, [field]: '' });
  };

  const handleRemoveListItem = (index, listKey) => {
    const updatedList = student[listKey].filter((_, i) => i !== index);
    updateProfile({ [listKey]: updatedList });
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let calculated = 40; // baseline
    if (student.cgpa >= 8.5) calculated += 15;
    else if (student.cgpa >= 7.0) calculated += 10;
    
    if (quizAnswers.dsa === 'high') calculated += 15;
    else if (quizAnswers.dsa === 'mid') calculated += 10;

    if (quizAnswers.projects === '3+') calculated += 15;
    else if (quizAnswers.projects === '1-2') calculated += 10;

    if (quizAnswers.resume === 'yes') calculated += 10;
    if (quizAnswers.interviews === 'yes') calculated += 5;

    calculated += Math.min(student.skills.length * 2, 10);
    calculated = Math.min(calculated, 100);

    setAnalyzerScore(calculated);
    setQuizSubmitted(true);
    updateProfile({ readinessScore: calculated });
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    const newMsgs = [...chatMessages, { sender: 'user', text: userMsg }];
    setChatMessages(newMsgs);
    setChatInput('');

    // Simulated AI response logic
    setTimeout(() => {
      let responseText = "That's an interesting question! For placement prep, I highly recommend building projects and practicing Data Structures & Algorithms on a regular basis. Would you like details on a specific role roadmap?";
      const msgLower = userMsg.toLowerCase();
      
      if (msgLower.includes('resume') || msgLower.includes('cv')) {
        responseText = "To make a stand-out resume, keep it to one page, highlight quantifiable metrics in projects (e.g., 'reduced load time by 30%'), and list skills matching the job description. Don't forget to upload it to our Resume Vault!";
      } else if (msgLower.includes('cgpa') || msgLower.includes('gpa') || msgLower.includes('eligibility')) {
        responseText = `Your current CGPA is ${student.cgpa}. Many top recruiting companies require a minimum CGPA of 7.5 or 8.0, and super-dream companies sometimes set thresholds at 8.5. Keep working hard to maintain or boost it!`;
      } else if (msgLower.includes('interview') || msgLower.includes('dsa') || msgLower.includes('experience')) {
        responseText = "Interview processes typically feature a coding round (DSA & system architecture) followed by 1-2 rounds of technical interviews and an HR fit round. Browse our Discussion Portal to read what companies like Amazon or Google asked seniors recently!";
      } else if (msgLower.includes('roadmap') || msgLower.includes('path') || msgLower.includes('frontend') || msgLower.includes('developer')) {
        responseText = "Under the Career Roadmaps tab, you can track progress on roles like Frontend Developer. Start with React, CSS layouts, and web optimization, then build 2-3 responsive projects to display in your profile.";
      }
      
      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 600);
  };

  // Filtered Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
                          job.company.toLowerCase().includes(jobSearch.toLowerCase()) || 
                          job.skillsRequired.some(s => s.toLowerCase().includes(jobSearch.toLowerCase()));
    
    if (jobFilter === 'all') return matchesSearch;
    if (jobFilter === 'jobs') return matchesSearch && job.type === 'Job';
    if (jobFilter === 'internships') return matchesSearch && job.type === 'Internship';
    if (jobFilter === 'eligible') {
      const passesCGPA = student.cgpa >= job.minCgpa;
      const passesBranch = job.departments.includes('All') || job.departments.includes(student.department);
      return matchesSearch && passesCGPA && passesBranch;
    }
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Overview Sub-tab */}
      {activeSubTab === 'overview' && (
        <div>
          <div className="glass-card bg-gradient-glass" style={{ padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome Back, {student.name}!</h2>
                    {student.verified ? (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> Profile Verified
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldAlert size={14} /> Pending Verification
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem', maxWidth: '600px' }}>
                    Monitor your job applications, career roadmaps, and interview preparations here. Keep your profile updated for direct eligibility calculations.
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '1px' }}>Department</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'hsl(var(--primary))' }}>{student.department} ({student.year})</div>
                </div>
              </div>
            </div>
            
            <div style={{ 
              position: 'absolute', right: '-50px', bottom: '-50px', width: '250px', height: '250px',
              background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', zIndex: 1 
            }}></div>
          </div>

          <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(99,102,241,0.1)', color: 'hsl(var(--primary))', borderRadius: '12px' }}>
                <Briefcase size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                  {applications.filter(a => a.studentId === student.id).length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Total Applications</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}>
                <CheckCircle size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                  {applications.filter(a => a.studentId === student.id && a.stage === 'Selected').length}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Offers Secured</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '12px' }}>
                <Compass size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                  {Math.round((Object.values(roadmapProgress).filter(Boolean).length / Object.keys(roadmapProgress).length) * 100)}%
                </div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Roadmap Progress</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}>
                <TrendingUp size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{student.readinessScore}%</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Placement Readiness</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
            {/* Quick Application Status */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} /> Application Timeline Summary
              </h3>
              
              {applications.filter(a => a.studentId === student.id).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'hsl(var(--muted-foreground))' }}>
                  <Briefcase size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p>You haven't applied to any roles yet.</p>
                  <button className="nav-link" style={{ display: 'inline-flex', marginTop: '16px', background: 'hsl(var(--primary))', color: 'white' }} onClick={() => setActiveSubTab('jobs')}>
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {applications.filter(a => a.studentId === student.id).map(app => {
                    const jobDetail = jobs.find(j => j.id === app.jobId);
                    return (
                      <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <h4 style={{ fontWeight: 600 }}>{jobDetail?.title}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>{jobDetail?.company}</span>
                        </div>
                        <div>
                          <span className={`badge ${
                            app.stage === 'Selected' ? 'badge-success' : 
                            app.stage === 'Rejected' ? 'badge-danger' : 'badge-primary'
                          }`}>
                            {app.stage}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions & Eligibility */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} /> Academic Eligibility Profile
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>CGPA</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'hsl(var(--primary))', marginTop: '4px' }}>{student.cgpa}</div>
                </div>
                
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Skills Logged</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#a855f7', marginTop: '4px' }}>{student.skills.length}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>Department</span>
                  <span style={{ fontWeight: 500 }}>{student.department}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>Resume status</span>
                  <span>
                    {resumes.length > 0 ? (
                      <span className="badge badge-success" style={{ padding: '2px 8px' }}>Active</span>
                    ) : (
                      <span className="badge badge-danger" style={{ padding: '2px 8px' }}>No Resume</span>
                    )}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>Overall eligibility</span>
                  <span className="badge badge-success">Eligible ( ड्रीम & Super Dream )</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Management Sub-tab */}
      {activeSubTab === 'profile' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Profile & Academics</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>Update your academic, project and skill details to qualify for recruitment drives.</p>
            </div>
            
            <button 
              className="glass-card" 
              style={{ padding: '10px 20px', background: editingProfile ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', color: editingProfile ? '#f87171' : 'white', fontWeight: 600 }}
              onClick={() => {
                setEditingProfile(!editingProfile);
                setProfileForm(prev => ({
                  ...prev,
                  cgpa: student.cgpa,
                  department: student.department,
                  year: student.year
                }));
              }}
            >
              {editingProfile ? 'Cancel Edit' : 'Edit Academics'}
            </button>
          </div>

          {editingProfile ? (
            <form onSubmit={handleProfileSave} className="glass-card" style={{ padding: '24px', border: '1px dashed rgba(99, 102, 241, 0.3)', marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Current CGPA</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max="10" 
                    value={profileForm.cgpa}
                    onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Department</label>
                  <select 
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                  >
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="IT">Information Technology</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="CE">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Academic Year</label>
                  <select 
                    value={profileForm.year}
                    onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year (Final)</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" style={{ padding: '10px 24px', background: 'hsl(var(--primary))', border: 'none', color: 'white', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}>
                Save Profile
              </button>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>CGPA Verified Score</span>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'hsl(var(--primary))', marginTop: '6px' }}>{student.cgpa} / 10.0</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Branch</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '6px' }}>{student.department} Engineering</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Academic Status</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '6px' }}>{student.year} Student</div>
              </div>
            </div>
          )}

          {/* Detailed Lists */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Skills & Certifications */}
            <div>
              <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} /> Core Skills & Technologies
                </h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="Add a skill (e.g. Java, Docker)..."
                    value={profileForm.newSkill}
                    onChange={(e) => setProfileForm({ ...profileForm, newSkill: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '6px' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddListItem('newSkill', 'skills')}
                  />
                  <button 
                    onClick={() => handleAddListItem('newSkill', 'skills')}
                    style={{ padding: '8px 16px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Add
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {student.skills.map((skill, index) => (
                    <span key={index} className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textTransform: 'none' }}>
                      {skill}
                      <Trash2 size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleRemoveListItem(index, 'skills')} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} /> Certifications
                </h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="Add certification (e.g. AWS Certified)..."
                    value={profileForm.newCert}
                    onChange={(e) => setProfileForm({ ...profileForm, newCert: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '6px' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddListItem('newCert', 'certifications')}
                  />
                  <button 
                    onClick={() => handleAddListItem('newCert', 'certifications')}
                    style={{ padding: '8px 16px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Add
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {student.certifications.map((cert, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                      <span>{cert}</span>
                      <Trash2 size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleRemoveListItem(index, 'certifications')} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects & Achievements */}
            <div>
              <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} /> Projects Completed
                </h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="Add project (e.g. E-commerce Microservices)..."
                    value={profileForm.newProject}
                    onChange={(e) => setProfileForm({ ...profileForm, newProject: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '6px' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddListItem('newProject', 'projects')}
                  />
                  <button 
                    onClick={() => handleAddListItem('newProject', 'projects')}
                    style={{ padding: '8px 16px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Add
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {student.projects.map((proj, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                      <span style={{ fontWeight: 500 }}>{proj}</span>
                      <Trash2 size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleRemoveListItem(index, 'projects')} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={18} /> Honors & Achievements
                </h3>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="Add achievement (e.g. Hackathon Winner)..."
                    value={profileForm.newAchievement}
                    onChange={(e) => setProfileForm({ ...profileForm, newAchievement: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '6px' }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddListItem('newAchievement', 'achievements')}
                  />
                  <button 
                    onClick={() => handleAddListItem('newAchievement', 'achievements')}
                    style={{ padding: '8px 16px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Add
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {student.achievements.map((ach, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                      <span>{ach}</span>
                      <Trash2 size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleRemoveListItem(index, 'achievements')} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Portal Sub-tab */}
      {activeSubTab === 'jobs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Jobs & Internships Portal</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>Find placement positions suited for your qualifications and skills.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'hsl(var(--muted-foreground))' }} />
                <input 
                  type="text" 
                  placeholder="Search jobs, tech..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  style={{ padding: '10px 12px 10px 36px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'white', width: '220px' }}
                />
              </div>
              
              <select 
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
              >
                <option value="all">All Postings</option>
                <option value="jobs">Full-time Jobs</option>
                <option value="internships">Internships</option>
                <option value="eligible">Eligible Only</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredJobs.map(job => {
              const applied = applications.some(a => a.studentId === student.id && a.jobId === job.id);
              const passesCGPA = student.cgpa >= job.minCgpa;
              const passesBranch = job.departments.includes('All') || job.departments.includes(student.department);
              const eligible = passesCGPA && passesBranch;

              return (
                <div key={job.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <span className="badge badge-primary" style={{ marginBottom: '8px' }}>{job.type}</span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>{job.title}</h3>
                        <span style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>{job.company}</span>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{job.package}</span>
                        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Package</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {job.skillsRequired.slice(0, 3).map((skill, i) => (
                        <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '4px' }}>{skill}</span>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>+{job.skillsRequired.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>Min CGPA: </span>
                        <span style={{ fontWeight: 600, color: passesCGPA ? '#10b981' : '#ef4444' }}>{job.minCgpa}</span>
                      </div>
                      
                      <div>
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>Branches: </span>
                        <span style={{ fontWeight: 600 }}>{job.departments.join(', ')}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="glass-card" 
                        style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: 'white', borderRadius: '6px', fontWeight: 500 }}
                        onClick={() => setSelectedJob(job)}
                      >
                        Details
                      </button>
                      
                      {applied ? (
                        <button className="badge badge-success" style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'default' }}>
                          <CheckCircle size={16} style={{ marginRight: '6px' }} /> Applied
                        </button>
                      ) : eligible ? (
                        <button 
                          style={{ flex: 1.5, background: 'hsl(var(--primary))', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                          onClick={() => applyForJob(job.id)}
                        >
                          Apply Now
                        </button>
                      ) : (
                        <button className="badge badge-danger" style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'not-allowed', opacity: 0.8 }}>
                          <XCircle size={16} style={{ marginRight: '6px' }} /> Not Eligible
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Job details Drawer */}
          {selectedJob && (
            <div>
              <div className="backdrop" onClick={() => setSelectedJob(null)}></div>
              <div className="detail-drawer" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <span className="badge badge-primary">{selectedJob.type}</span>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '8px 0 4px' }}>{selectedJob.title}</h2>
                    <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>{selectedJob.company}</p>
                  </div>
                  <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '4px' }}>
                  <div className="glass-card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>COMPENSATION</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{selectedJob.package}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>JOB LOCATION</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedJob.location || 'Bangalore, India'}</div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Job Description</h3>
                    <p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6, fontSize: '0.95rem' }}>
                      {selectedJob.description || `We are looking for a skilled developer to join our engineering department. You will cooperate in a fast-paced environment to build modular web services, deploy features, and coordinate designs.`}
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Eligibility & Criteria</h3>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>Minimum CGPA:</span>
                        <span style={{ fontWeight: 600 }}>{selectedJob.minCgpa}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>Allowed Branches:</span>
                        <span style={{ fontWeight: 600 }}>{selectedJob.departments.join(', ')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>Your Status:</span>
                        <span>
                          {student.cgpa >= selectedJob.minCgpa ? (
                            <span className="badge badge-success" style={{ padding: '2px 8px' }}>Meets Criteria</span>
                          ) : (
                            <span className="badge badge-danger" style={{ padding: '2px 8px' }}>Below Threshold</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Skills Required</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedJob.skillsRequired.map((skill, i) => (
                        <span key={i} className="badge badge-primary" style={{ textTransform: 'none' }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '20px', marginTop: '20px' }}>
                  {applications.some(a => a.studentId === student.id && a.jobId === selectedJob.id) ? (
                    <button className="badge badge-success" style={{ width: '100%', padding: '12px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem', cursor: 'default' }}>
                      <CheckCircle size={18} /> Already Applied
                    </button>
                  ) : (student.cgpa >= selectedJob.minCgpa) ? (
                    <button 
                      style={{ width: '100%', padding: '12px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                      onClick={() => {
                        applyForJob(selectedJob.id);
                        setSelectedJob(null);
                      }}
                    >
                      Apply Directly
                    </button>
                  ) : (
                    <button className="badge badge-danger" style={{ width: '100%', padding: '12px', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '1rem', cursor: 'not-allowed', opacity: 0.8 }}>
                      <XCircle size={18} /> CGPA Not Met
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Application Tracking Sub-tab */}
      {activeSubTab === 'applications' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Your Job Applications</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>Track the detailed stages of your active recruitment drives.</p>

          {applications.filter(a => a.studentId === student.id).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'hsl(var(--muted-foreground))' }}>
              <Briefcase size={50} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p>You haven't applied to any roles yet.</p>
              <button 
                onClick={() => setActiveSubTab('jobs')}
                style={{ marginTop: '16px', padding: '10px 24px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Find Opportunities
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {applications.filter(a => a.studentId === student.id).map(app => {
                const jobDetail = jobs.find(j => j.id === app.jobId);
                const stages = ['Applied', 'Assessment', 'Interview Scheduled', 'Selected'];
                const currentStageIndex = stages.indexOf(app.stage) !== -1 ? stages.indexOf(app.stage) : 0;
                
                return (
                  <div key={app.id} className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                      <div>
                        <span className="badge badge-primary" style={{ marginBottom: '6px' }}>{jobDetail?.type}</span>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>{jobDetail?.title}</h3>
                        <p style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>{jobDetail?.company} &bull; {jobDetail?.package}</p>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span className="badge badge-primary" style={{ marginBottom: '6px' }}>Applied: {app.date}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>Current Status:</span>
                          <span className={`badge ${
                            app.stage === 'Selected' ? 'badge-success' : 
                            app.stage === 'Rejected' ? 'badge-danger' : 'badge-primary'
                          }`}>{app.stage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Stages */}
                    {app.stage !== 'Rejected' ? (
                      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                        {/* Connection Line */}
                        <div style={{ 
                          position: 'absolute', top: '15px', left: '0', right: '0', height: '3px', 
                          background: `linear-gradient(to right, hsl(var(--primary)) ${currentStageIndex * 33}%, hsl(var(--muted)) ${currentStageIndex * 33}%)`,
                          zIndex: 1 
                        }}></div>

                        {stages.map((stage, i) => {
                          const isActive = i <= currentStageIndex;
                          const isCurrent = i === currentStageIndex;
                          return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, flex: 1 }}>
                              <div style={{ 
                                width: '30px', height: '30px', borderRadius: '50%', 
                                background: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                                border: '4px solid hsl(var(--card))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 'bold', fontSize: '0.8rem',
                                transition: 'all 0.3s ease',
                                boxShadow: isCurrent ? '0 0 12px hsl(var(--primary))' : 'none'
                              }}>
                                {isActive ? '✓' : i + 1}
                              </div>
                              <span style={{ 
                                marginTop: '10px', fontSize: '0.8rem', 
                                color: isActive ? 'white' : 'hsl(var(--muted-foreground))',
                                fontWeight: isCurrent ? 600 : 400,
                                textAlign: 'center'
                              }}>
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '16px', borderRadius: '8px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <XCircle size={20} />
                        <div>
                          <strong>Drive Completed</strong>
                          <p style={{ fontSize: '0.85rem', color: '#fca5a5', marginTop: '2px' }}>Unfortunately, you were not selected for this role. Keep practicing and apply for upcoming opportunities!</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Career Roadmaps Sub-tab */}
      {activeSubTab === 'roadmaps' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Structured Career Roadmaps</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '30px' }}>Learn and cross-verify key modules required for technical profiles.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid hsl(var(--primary))', background: 'rgba(99, 102, 241, 0.04)' }}>
                <h3 style={{ fontWeight: 600 }}>Frontend Engineer</h3>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>React, JS, CSS Architecture, Webpack</p>
              </div>
              <div className="glass-card" style={{ padding: '16px', opacity: 0.6, cursor: 'not-allowed' }}>
                <h3 style={{ fontWeight: 600 }}>Backend Systems Engineer (Locked)</h3>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Node, Go, SQL, System Design</p>
              </div>
              <div className="glass-card" style={{ padding: '16px', opacity: 0.6, cursor: 'not-allowed' }}>
                <h3 style={{ fontWeight: 600 }}>Data Scientist (Locked)</h3>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Python, NumPy, Scikit, Spark</p>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Frontend Track Progress</h3>
                <span className="badge badge-primary">
                  {Math.round((Object.values(roadmapProgress).filter(Boolean).length / Object.keys(roadmapProgress).length) * 100)}% Complete
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.keys(roadmapProgress).map((topic, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                    <div 
                      className={`roadmap-checkbox ${roadmapProgress[topic] ? 'checked' : ''}`}
                      onClick={() => {
                        const updated = { ...roadmapProgress, [topic]: !roadmapProgress[topic] };
                        setRoadmapProgress(updated);
                        
                        // Recalculate student readiness
                        const checkedCount = Object.values(updated).filter(Boolean).length;
                        const baseline = 60 + checkedCount * 5;
                        updateProfile({ readinessScore: Math.min(baseline, 100) });
                      }}
                    ></div>
                    <div>
                      <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: roadmapProgress[topic] ? 'white' : 'hsl(var(--muted-foreground))' }}>{topic}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Module validation for placement readiness check</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Vault Sub-tab */}
      {activeSubTab === 'resume-vault' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Resume Vault</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>Upload and maintain your resumes. Choose a primary resume to auto-submit with applications.</p>

          <div 
            className="glass-card" 
            style={{ 
              border: '2px dashed rgba(255, 255, 255, 0.1)', 
              padding: '40px', 
              textAlign: 'center', 
              marginBottom: '32px',
              borderRadius: '12px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.01)'
            }}
            onClick={() => {
              const name = prompt("Enter a name for the resume (e.g. Frontend-2026.pdf):");
              if (name && name.trim()) {
                addResume({
                  name: name.trim(),
                  date: new Date().toLocaleDateString(),
                  primary: resumes.length === 0
                });
              }
            }}
          >
            <Upload size={32} style={{ color: 'hsl(var(--primary))', marginBottom: '12px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Click to Upload Resume</h3>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>Supports PDF format up to 5MB. Click here to simulate file upload.</p>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px' }}>Uploaded Resumes ({resumes.length})</h3>
          
          {resumes.length === 0 ? (
            <p style={{ color: 'hsl(var(--muted-foreground))', fontStyle: 'italic' }}>No resumes uploaded yet. Upload one to start applying.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {resumes.map(res => (
                <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <FileText size={24} style={{ color: 'hsl(var(--primary))' }} />
                    <div>
                      <h4 style={{ fontWeight: 600 }}>{res.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Uploaded: {res.date}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {res.primary ? (
                      <span className="badge badge-success">Primary Resume</span>
                    ) : (
                      <button 
                        className="glass-card" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'white' }}
                        onClick={() => setPrimaryResume(res.id)}
                      >
                        Set Primary
                      </button>
                    )}
                    
                    <button 
                      onClick={() => deleteResume(res.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8 }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discussion Portal Sub-tab */}
      {activeSubTab === 'discussions' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Student Discussion & QA Portal</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>Share interview questions, talk about recruitment workflows, and seek guidance from seniors.</p>

          {/* Form to submit discussion */}
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.15)', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Share an Experience or Question</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Topic / Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. SDE Interview Experience..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Company</label>
                <input 
                  type="text" 
                  placeholder="e.g. Google, Amazon..."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Category</label>
                <select 
                  value={discussionType}
                  onChange={(e) => setDiscussionType(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '6px' }}
                >
                  <option value="Interview Experience">Interview Experience</option>
                  <option value="Recruitment QA">Recruitment QA</option>
                  <option value="Placement Queries">Placement Queries</option>
                  <option value="Skill Guidance">Skill Guidance</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Details / Content</label>
              <textarea 
                rows="3" 
                placeholder="Share technical questions asked, tips for round clearance, or questions for seniors..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '6px', resize: 'vertical' }}
              ></textarea>
            </div>

            <button 
              style={{ padding: '8px 20px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => {
                if (!newTopic.trim() || !newContent.trim()) return;
                addDiscussionPost({
                  title: newTopic.trim(),
                  company: newCompany.trim(),
                  category: discussionType,
                  content: newContent.trim(),
                  user: student.name,
                  date: 'Today'
                });
                setNewTopic('');
                setNewCompany('');
                setNewContent('');
              }}
            >
              Post to Forum
            </button>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Recent Posts</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {discussions.map(post => (
              <div key={post.id} className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginRight: '8px' }}>{post.category}</span>
                    {post.company && <span className="badge badge-success">{post.company}</span>}
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 600, marginTop: '8px' }}>{post.title}</h4>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Posted by {post.user} ({post.date})</span>
                </div>
                <p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.5, fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placement Readiness Analyzer Sub-tab */}
      {activeSubTab === 'readiness-analyzer' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Placement Readiness Analyzer</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>Evaluate your placement preparedness using skills, project logs, and quick validation checks.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
            
            <div>
              <form onSubmit={handleQuizSubmit} className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '20px' }}>Readiness Score Quiz</h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Data Structures & Algorithms Confidence Level</label>
                  <select 
                    value={quizAnswers.dsa}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, dsa: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                    required
                  >
                    <option value="">Select level...</option>
                    <option value="high">Advanced (Recursion, Trees, Graphs, DP)</option>
                    <option value="mid">Intermediate (Arrays, Strings, Stacks, Searching)</option>
                    <option value="low">Beginner (Looping, basic operations)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>How many core tech projects have you added to your profile?</label>
                  <select 
                    value={quizAnswers.projects}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, projects: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                    required
                  >
                    <option value="">Select project count...</option>
                    <option value="3+">3 or more active projects</option>
                    <option value="1-2">1 to 2 basic projects</option>
                    <option value="0">None yet</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Have you completed and uploaded your resume to the Vault?</label>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="resume" value="yes" checked={quizAnswers.resume === 'yes'} onChange={(e) => setQuizAnswers({ ...quizAnswers, resume: e.target.value })} required /> Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="resume" value="no" checked={quizAnswers.resume === 'no'} onChange={(e) => setQuizAnswers({ ...quizAnswers, resume: e.target.value })} /> No
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px' }}>Have you practiced mock coding interviews before?</label>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="interviews" value="yes" checked={quizAnswers.interviews === 'yes'} onChange={(e) => setQuizAnswers({ ...quizAnswers, interviews: e.target.value })} required /> Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="radio" name="interviews" value="no" checked={quizAnswers.interviews === 'no'} onChange={(e) => setQuizAnswers({ ...quizAnswers, interviews: e.target.value })} /> No
                    </label>
                  </div>
                </div>

                <button type="submit" style={{ padding: '10px 24px', background: 'hsl(var(--primary))', border: 'none', color: 'white', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}>
                  Calculate Readiness
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Your Preparation Score</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: analyzerScore >= 75 ? '#10b981' : analyzerScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {analyzerScore}%
                </div>
                <span className="badge badge-primary" style={{ marginTop: '8px' }}>
                  {analyzerScore >= 75 ? 'Job Ready' : analyzerScore >= 50 ? 'Needs Practice' : 'Critical Focus Required'}
                </span>
                
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginTop: '20px' }}>
                  <div style={{ width: `${analyzerScore}%`, height: '100%', background: analyzerScore >= 75 ? '#10b981' : analyzerScore >= 50 ? '#f59e0b' : '#ef4444', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>

              {quizSubmitted && (
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>AI Feedback & Tips</h3>
                  <ul style={{ paddingLeft: '18px', color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analyzerScore < 75 && <li>DSA Practice: Practice basic algorithms (sorting, list operations).</li>}
                    {quizAnswers.projects === '0' && <li>Build Projects: Create at least one responsive React web app.</li>}
                    {quizAnswers.resume === 'no' && <li>Resume Vault: Upload your resume immediately to enable eligibility links.</li>}
                    <li>CGPA Status: Maintain your {student.cgpa} CGPA to clear cut-offs.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Guidance Sub-tab */}
      {activeSubTab === 'ai-guidance' && (
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '520px' }}>
          <div style={{ borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Compass size={24} style={{ color: 'hsl(var(--primary))' }} /> AI Placement Assistant
            </h2>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>Ask quick career questions and get simulated dynamic responses.</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '6px', marginBottom: '20px' }}>
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Ask about resume tips, DSA, interview stages, or eligibility..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'white' }}
            />
            <button 
              type="submit" 
              style={{ padding: '12px 24px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
