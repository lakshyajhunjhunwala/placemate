import React, { useState } from 'react';
import { 
  Users, Building, Briefcase, Award, TrendingUp, Search, 
  Check, X, Plus, Calendar, FileText, CheckCircle, Star, Trash2
} from 'lucide-react';

export default function OfficerDashboard({
  students,
  companies,
  jobs,
  applications,
  verifyStudent,
  addCompany,
  addJob,
  updateApplicationStage,
  activeSubTab,
  setActiveSubTab
}) {
  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');

  // Form states - Add Company
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    sector: '',
    avgPackage: '',
    hiredCount: 0
  });

  // Form states - Add Job
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    type: 'Job',
    package: '',
    minCgpa: 7.0,
    departments: ['CSE'],
    skills: ''
  });

  // Selected student details popup
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (!companyForm.name.trim() || !companyForm.sector.trim()) return;
    addCompany({
      name: companyForm.name.trim(),
      sector: companyForm.sector.trim(),
      avgPackage: companyForm.avgPackage || 'N/A',
      hiredCount: parseInt(companyForm.hiredCount) || 0
    });
    setCompanyForm({ name: '', sector: '', avgPackage: '', hiredCount: 0 });
    setShowCompanyForm(false);
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (!jobForm.title.trim() || !jobForm.company.trim()) return;
    addJob({
      title: jobForm.title.trim(),
      company: jobForm.company,
      type: jobForm.type,
      package: jobForm.package || 'N/A',
      minCgpa: parseFloat(jobForm.minCgpa) || 0,
      departments: jobForm.departments,
      skillsRequired: jobForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setJobForm({
      title: '',
      company: '',
      type: 'Job',
      package: '',
      minCgpa: 7.0,
      departments: ['CSE'],
      skills: ''
    });
    setShowJobForm(false);
  };

  const handleDeptToggle = (dept) => {
    const current = [...jobForm.departments];
    if (current.includes(dept)) {
      setJobForm({ ...jobForm, departments: current.filter(d => d !== dept) });
    } else {
      setJobForm({ ...jobForm, departments: [...current, dept] });
    }
  };

  // Calculations for dashboard counters
  const totalStudents = students.length;
  const verifiedCount = students.filter(s => s.verified).length;
  const placedCount = students.filter(s => 
    applications.some(a => a.studentId === s.id && a.stage === 'Selected')
  ).length;
  const placementRate = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0;
  const activeJobsCount = jobs.length;

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Overview Sub-tab */}
      {activeSubTab === 'overview' && (
        <div>
          <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(99,102,241,0.1)', color: 'hsl(var(--primary))', borderRadius: '12px' }}>
                <Users size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalStudents}</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Total Registered Students</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}>
                <TrendingUp size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{placementRate}%</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Overall Placement Rate</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '12px' }}>
                <Building size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{companies.length}</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Recruiting Companies</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}>
                <Briefcase size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{activeJobsCount}</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Active Opportunities</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', flexWrap: 'wrap' }}>
            {/* Quick Actions Panel */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Recent Drives & Applications</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {applications.slice(0, 5).map(app => {
                  const stud = students.find(s => s.id === app.studentId);
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{stud?.name}</div>
                        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>
                          applied for {job?.title} at {job?.company}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="badge badge-primary">{app.stage}</span>
                        <button 
                          className="glass-card" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'white' }}
                          onClick={() => setActiveSubTab('tracking')}
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Widgets */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Student Profile Verifications</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>Verified Profiles</span>
                  <span style={{ fontWeight: 600, color: '#10b981' }}>{verifiedCount} / {totalStudents}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'hsl(var(--muted-foreground))' }}>Verification rate</span>
                  <span style={{ fontWeight: 600 }}>{totalStudents > 0 ? Math.round((verifiedCount / totalStudents) * 100) : 0}%</span>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '8px', color: '#fde047', fontSize: '0.85rem' }}>
                <strong>Pending Action:</strong> We have {totalStudents - verifiedCount} students awaiting academic profile verification before eligibility can be officially locked.
              </div>
              
              <button 
                onClick={() => setActiveSubTab('students')}
                style={{ width: '100%', marginTop: '20px', padding: '10px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Verify Profiles Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Management Sub-tab */}
      {activeSubTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>Students</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>{totalStudents} registered students</p>
            </div>
            
            <button 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 24px', 
                background: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: 600,
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
              }}
            >
              <Plus size={18} /> Add Student
            </button>
          </div>

          {/* Stats Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* TOTAL */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid #64748b' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{totalStudents}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TOTAL</span>
            </div>

            {/* VERIFIED */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #16a34a' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{verifiedCount}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>VERIFIED</span>
            </div>

            {/* PLACED */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#eff6ff', border: '1px solid #dbeafe', borderLeft: '4px solid #2563eb' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb', lineHeight: 1 }}>{placedCount}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.05em', textTransform: 'uppercase' }}>PLACED</span>
            </div>
          </div>

          {/* Search bar & Table Card */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px 12px 48px', 
                  background: '#f1f5f9', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  color: '#0f172a',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 16px' }}>STUDENT</th>
                    <th style={{ padding: '12px 16px' }}>REGISTER NO</th>
                    <th style={{ padding: '12px 16px' }}>DEPT / YEAR</th>
                    <th style={{ padding: '12px 16px' }}>CGPA</th>
                    <th style={{ padding: '12px 16px' }}>PROFILE</th>
                    <th style={{ padding: '12px 16px' }}>PLACEMENT</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.registerNo.toLowerCase().includes(studentSearch.toLowerCase()))
                    .map(stud => {
                      const isPlaced = stud.placementStatus === 'PLACED';
                      
                      return (
                        <tr key={stud.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.95rem', verticalAlign: 'middle' }}>
                          {/* Student Avatar + Info */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%', 
                                background: '#2563eb', 
                                color: 'white', 
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold', 
                                fontSize: '0.95rem' 
                              }}>
                                {stud.name.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{stud.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{stud.email}</span>
                              </div>
                            </div>
                          </td>
                          
                          {/* Register No */}
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#334155' }}>
                            {stud.registerNo}
                          </td>
                          
                          {/* Dept / Year */}
                          <td style={{ padding: '12px 16px', color: '#475569' }}>
                            {stud.department ? `${stud.department} · ${stud.year}` : '—'}
                          </td>
                          
                          {/* CGPA */}
                          <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>
                            {stud.cgpa !== null ? stud.cgpa : '—'}
                          </td>
                          
                          {/* Profile Badge */}
                          <td style={{ padding: '12px 16px' }}>
                            <span className={`badge ${
                              stud.profileStatus === 'VERIFIED' ? 'badge-success' : 
                              stud.profileStatus === 'SUBMITTED' ? 'badge-warning' : 'badge-neutral'
                            }`}>
                              {stud.profileStatus}
                            </span>
                          </td>
                          
                          {/* Placement Badge */}
                          <td style={{ padding: '12px 16px' }}>
                            <span className={`badge ${
                              isPlaced ? 'badge-success' : 'badge-neutral'
                            }`}>
                              {isPlaced ? 'PLACED' : 'NOT PLACED'}
                            </span>
                          </td>
                          
                          {/* Actions */}
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '12px', alignItems: 'center' }}>
                              {/* Profile View (blue outline user icon) */}
                              <button 
                                onClick={() => setSelectedStudentDetail(stud)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', padding: '4px', display: 'flex', alignItems: 'center' }}
                                title="View Profile Details"
                              >
                                <Users size={18} />
                              </button>
                              
                              {/* Verify Checkmark (green circle check) - only shown if submitted */}
                              {stud.profileStatus === 'SUBMITTED' && (
                                <button 
                                  onClick={() => verifyStudent(stud.id, true)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '4px', display: 'flex', alignItems: 'center' }}
                                  title="Verify Profile"
                                >
                                  <CheckCircle size={18} />
                                </button>
                              )}
                              
                              {/* Delete Trash (red outline trash) */}
                              <button 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px', display: 'flex', alignItems: 'center' }}
                                title="Delete Entry"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student details popup drawer */}
          {selectedStudentDetail && (
            <div>
              <div className="backdrop" onClick={() => setSelectedStudentDetail(null)}></div>
              <div className="detail-drawer" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{selectedStudentDetail.name}</h2>
                    <p style={{ color: '#64748b' }}>Student Placement Dossier</p>
                  </div>
                  <button onClick={() => setSelectedStudentDetail(null)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="glass-card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ACADEMIC CGPA</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                        {selectedStudentDetail.cgpa !== null ? `${selectedStudentDetail.cgpa} / 10.0` : '—'}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>BRANCH / YEAR</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        {selectedStudentDetail.department ? `${selectedStudentDetail.department} (${selectedStudentDetail.year})` : '—'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Log of Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedStudentDetail.skills && selectedStudentDetail.skills.length > 0 ? (
                        selectedStudentDetail.skills.map((s, i) => (
                          <span key={i} className="badge badge-primary" style={{ textTransform: 'none' }}>{s}</span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic' }}>No skills logged</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Academic Projects</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedStudentDetail.projects && selectedStudentDetail.projects.length > 0 ? (
                        selectedStudentDetail.projects.map((p, i) => (
                          <div key={i} style={{ background: '#f8fafc', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', color: '#334155' }}>{p}</div>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic' }}>No projects logged</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Certifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedStudentDetail.certifications && selectedStudentDetail.certifications.length > 0 ? (
                        selectedStudentDetail.certifications.map((c, i) => (
                          <div key={i} style={{ background: '#f8fafc', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.9rem', color: '#334155' }}>{c}</div>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic' }}>No certifications logged</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '20px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => {
                      verifyStudent(selectedStudentDetail.id, !selectedStudentDetail.verified);
                      setSelectedStudentDetail(null);
                    }}
                    style={{ flex: 1, padding: '12px', background: selectedStudentDetail.verified ? 'rgba(239,68,68,0.1)' : 'hsl(var(--primary))', color: selectedStudentDetail.verified ? '#ef4444' : 'white', border: selectedStudentDetail.verified ? '1px solid rgba(239,68,68,0.2)' : 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {selectedStudentDetail.verified ? 'Revoke Verification' : 'Confirm Verification'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Company Management Sub-tab */}
      {activeSubTab === 'companies' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Company Management Directory</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>Register recruiting organizations and maintain central placement statistics.</p>
            </div>
            
            <button 
              onClick={() => setShowCompanyForm(!showCompanyForm)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              <Plus size={16} /> Add Company
            </button>
          </div>

          {/* Add Company Form Modal */}
          {showCompanyForm && (
            <div>
              <div className="backdrop" onClick={() => setShowCompanyForm(false)}></div>
              <div className="detail-drawer" style={{ padding: '32px', width: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Register New Company</h3>
                  <button onClick={() => setShowCompanyForm(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <form onSubmit={handleCompanySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Company Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Microsoft..."
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Sector / Domain</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Technology, Finance..."
                      value={companyForm.sector}
                      onChange={(e) => setCompanyForm({ ...companyForm, sector: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Avg Package (LPA)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 18 LPA..."
                      value={companyForm.avgPackage}
                      onChange={(e) => setCompanyForm({ ...companyForm, avgPackage: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Total Hired Students</label>
                    <input 
                      type="number" 
                      value={companyForm.hiredCount}
                      onChange={(e) => setCompanyForm({ ...companyForm, hiredCount: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                    />
                  </div>

                  <button type="submit" style={{ marginTop: '10px', padding: '12px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    Register Company
                  </button>
                </form>
              </div>
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px 8px' }}>Company Name</th>
                <th style={{ padding: '12px 8px' }}>Sector</th>
                <th style={{ padding: '12px 8px' }}>Average Package</th>
                <th style={{ padding: '12px 8px' }}>Total Hired Count</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {companies
                .filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()))
                .map(comp => (
                  <tr key={comp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '16px 8px', fontWeight: 600 }}>{comp.name}</td>
                    <td style={{ padding: '16px 8px' }}>{comp.sector}</td>
                    <td style={{ padding: '16px 8px', color: 'hsl(var(--primary))', fontWeight: 'bold' }}>{comp.avgPackage}</td>
                    <td style={{ padding: '16px 8px', fontWeight: 600 }}>{comp.hiredCount} Students</td>
                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <span className="badge badge-success">Active recruiter</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Job listings Management Sub-tab */}
      {activeSubTab === 'jobs' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Published Jobs & Opportunities</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>Publish placements and set department, CGPA thresholds.</p>
            </div>
            
            <button 
              onClick={() => setShowJobForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              <Plus size={16} /> Publish Opportunity
            </button>
          </div>

          {showJobForm && (
            <div>
              <div className="backdrop" onClick={() => setShowJobForm(false)}></div>
              <div className="detail-drawer" style={{ padding: '32px', width: '450px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Publish Placement Opportunity</h3>
                  <button onClick={() => setShowJobForm(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <form onSubmit={handleJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Job/Internship Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Software Development Engineer..."
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Recruiting Company</label>
                    <select 
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                      required
                    >
                      <option value="">Select Company...</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Type</label>
                      <select 
                        value={jobForm.type}
                        onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                      >
                        <option value="Job">Full-time Job</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Package (LPA / Stipend)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 15 LPA or 50k/pm"
                        value={jobForm.package}
                        onChange={(e) => setJobForm({ ...jobForm, package: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Minimum CGPA Requirement</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="0" 
                      max="10"
                      value={jobForm.minCgpa}
                      onChange={(e) => setJobForm({ ...jobForm, minCgpa: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Target Departments</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['CSE', 'ECE', 'IT', 'ME', 'CE', 'All'].map(dept => (
                        <button
                          type="button"
                          key={dept}
                          onClick={() => handleDeptToggle(dept)}
                          className="glass-card"
                          style={{ 
                            padding: '6px 12px', 
                            fontSize: '0.8rem', 
                            background: jobForm.departments.includes(dept) ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))', marginBottom: '6px' }}>Required Skills (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. React, JavaScript, Node.js"
                      value={jobForm.skills}
                      onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', color: 'white', borderRadius: '8px' }}
                    />
                  </div>

                  <button type="submit" style={{ marginTop: '10px', padding: '12px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    Publish Posting
                  </button>
                </form>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {jobs.map(job => (
              <div key={job.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <span className="badge badge-primary">{job.type}</span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '8px' }}>{job.title}</h3>
                      <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>{job.company}</p>
                    </div>
                    
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{job.package}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {job.skillsRequired.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: '4px' }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Min CGPA Requirement: <strong>{job.minCgpa}</strong></span>
                  <span>Branch: <strong>{job.departments.join(', ')}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recruitment drive application workflow tracking */}
      {activeSubTab === 'tracking' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Active Application Workflows</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>Move students through recruitment funnel stages (Applied, Assessment, Interview, Selected).</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px 8px' }}>Candidate Name</th>
                <th style={{ padding: '12px 8px' }}>Company & Role</th>
                <th style={{ padding: '12px 8px' }}>Application Date</th>
                <th style={{ padding: '12px 8px' }}>Current Stage</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Workflow control</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => {
                const stud = students.find(s => s.id === app.studentId);
                const job = jobs.find(j => j.id === app.jobId);
                
                return (
                  <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ fontWeight: 600 }}>{stud?.name}</div>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>{stud?.department} &bull; CGPA {stud?.cgpa}</span>
                    </td>
                    
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ fontWeight: 600 }}>{job?.title}</div>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>{job?.company}</span>
                    </td>

                    <td style={{ padding: '16px 8px' }}>{app.date}</td>
                    
                    <td style={{ padding: '16px 8px' }}>
                      <span className={`badge ${
                        app.stage === 'Selected' ? 'badge-success' : 
                        app.stage === 'Rejected' ? 'badge-danger' : 'badge-primary'
                      }`}>{app.stage}</span>
                    </td>

                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {app.stage !== 'Selected' && app.stage !== 'Rejected' && (
                          <>
                            <button 
                              onClick={() => {
                                const stages = ['Applied', 'Assessment', 'Interview Scheduled', 'Selected'];
                                const nextIndex = stages.indexOf(app.stage) + 1;
                                if (nextIndex < stages.length) {
                                  updateApplicationStage(app.id, stages[nextIndex]);
                                }
                              }}
                              style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Advance Stage
                            </button>
                            
                            <button 
                              onClick={() => updateApplicationStage(app.id, 'Rejected')}
                              style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        
                        {(app.stage === 'Selected' || app.stage === 'Rejected') && (
                          <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85rem' }}>Process Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reports & Analytics Sub-tab with SVG charts */}
      {activeSubTab === 'reports' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Placement Reports & Recruitment Analytics</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '32px' }}>Visual insights regarding selection distributions and department performance metrics.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', marginBottom: '30px', flexWrap: 'wrap' }}>
            
            {/* SVG Donut Chart for Overall Placement Rate */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', alignSelf: 'flex-start' }}>Overall Placement Status</h3>
              
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background Ring */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
                
                {/* Placement Rate Segment */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="75" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="20" 
                  strokeDasharray={`${2 * Math.PI * 75}`}
                  strokeDashoffset={`${2 * Math.PI * 75 * (1 - placementRate/100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                
                <text x="100" y="105" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
                  {placementRate}%
                </text>
                <text x="100" y="125" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="12">
                  Placed
                </text>
              </svg>

              <div style={{ display: 'flex', gap: '20px', marginTop: '20px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'hsl(var(--primary))', borderRadius: '50%' }}></span>
                  <span>Placed ({placedCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></span>
                  <span>Unplaced ({totalStudents - placedCount})</span>
                </div>
              </div>
            </div>

            {/* SVG Bar Chart for Department Placements */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>Placed Students by Department</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                {['CSE', 'ECE', 'IT', 'ME'].map(dept => {
                  const deptStudents = students.filter(s => s.department === dept);
                  const deptPlaced = deptStudents.filter(s => 
                    applications.some(a => a.studentId === s.id && a.stage === 'Selected')
                  ).length;
                  const pct = deptStudents.length > 0 ? Math.round((deptPlaced / deptStudents.length) * 100) : 0;
                  
                  return (
                    <div key={dept}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span>{dept} Department ({deptPlaced} of {deptStudents.length} placed)</span>
                        <span style={{ fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(to right, #818cf8, #a78bfa)', borderRadius: '5px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '16px' }}>Hiring Drive Conversion Funnel</h3>
            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', marginBottom: '20px' }}>Conversion pipeline statistics for active and completed recruiting sessions.</p>
            
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              {[
                { label: 'Applications Filed', count: applications.length, color: 'hsl(250, 85%, 65%)' },
                { label: 'Cleared Assessments', count: applications.filter(a => ['Assessment', 'Interview Scheduled', 'Selected'].includes(a.stage)).length, color: 'hsl(265, 85%, 60%)' },
                { label: 'Interviews Scheduled', count: applications.filter(a => ['Interview Scheduled', 'Selected'].includes(a.stage)).length, color: 'hsl(280, 85%, 55%)' },
                { label: 'Offers Released', count: applications.filter(a => a.stage === 'Selected').length, color: '#10b981' }
              ].map((stage, idx, arr) => {
                const pct = arr[0].count > 0 ? Math.round((stage.count / arr[0].count) * 100) : 0;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '150px', fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>{stage.label}</div>
                    <div style={{ flex: 1, height: '36px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: stage.color, opacity: 0.85 }}></div>
                      <span style={{ position: 'absolute', left: '12px', top: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                        {stage.count} candidates ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Internships Management Sub-tab */}
      {activeSubTab === 'internships' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Internships Directory</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>Manage corporate internship roles and candidate thresholds.</p>
            </div>
            
            <button 
              onClick={() => {
                setJobForm(prev => ({ ...prev, type: 'Internship' }));
                setShowJobForm(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              <Plus size={16} /> Publish Internship
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {jobs.filter(j => j.type === 'Internship').map(job => (
              <div key={job.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <span className="badge badge-primary">{job.type}</span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '8px', color: '#0f172a' }}>{job.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{job.company}</p>
                    </div>
                    
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb' }}>{job.package}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {job.skillsRequired.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569' }}>
                  <span>Min CGPA: <strong>{job.minCgpa}</strong></span>
                  <span>Branch: <strong>{job.departments.join(', ')}</strong></span>
                </div>
              </div>
            ))}
            {jobs.filter(j => j.type === 'Internship').length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No active internships published.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Placements Sub-tab */}
      {activeSubTab === 'placements' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Placed Candidates Registry</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>Official roster of candidates with confirmed corporate selections.</p>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 16px' }}>STUDENT</th>
                <th style={{ padding: '12px 16px' }}>REGISTER NO</th>
                <th style={{ padding: '12px 16px' }}>COMPANY & ROLE</th>
                <th style={{ padding: '12px 16px' }}>COMPENSATION</th>
                <th style={{ padding: '12px 16px' }}>DEPT / YEAR</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => s.placementStatus === 'PLACED')
                .map(stud => {
                  const app = applications.find(a => a.studentId === stud.id && a.stage === 'Selected');
                  const job = jobs.find(j => j.id === app?.jobId);
                  
                  return (
                    <tr key={stud.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.95rem' }}>
                      <td style={{ padding: '16px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '50%', 
                            background: '#2563eb', 
                            color: 'white', 
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold', 
                            fontSize: '0.95rem' 
                          }}>
                            {stud.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{stud.name}</span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{stud.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 16px', fontWeight: 600, color: '#334155' }}>{stud.registerNo}</td>
                      <td style={{ padding: '16px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{job?.company || 'Corporate Partner'}</div>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{job?.title || 'Selected Candidate'}</span>
                      </td>
                      <td style={{ padding: '16px 16px', fontWeight: 700, color: '#2563eb' }}>{job?.package || 'N/A'}</td>
                      <td style={{ padding: '16px 16px', color: '#475569' }}>{stud.department ? `${stud.department} · ${stud.year}` : '—'}</td>
                      <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                        <span className="badge badge-success">Placed & Confirmed</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* My Profile Sub-tab */}
      {activeSubTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: '#10b981', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold', 
              fontSize: '2.5rem' 
            }}>
              P
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Placement Officer Account</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Ecosystem Administrator & Coordinator</p>
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <span className="badge badge-success">Official Staff</span>
                <span className="badge badge-primary">Admin Privilege</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Administrative Dossier</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>OFFICIAL NAME</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>Admin Officer (PO)</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>EMAIL ADDRESS</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>officer@placemate.com</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>DEPARTMENT</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>Career Guidance & Placements Office</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>CAMPUS OFFICE</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>Room 204, Administrative Block</div>
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ROLE RESPONSIBILITIES</span>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.9rem', color: '#334155', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Maintain placement and internship drives calendar</li>
                <li>Verify student academic data and CGPA credentials</li>
                <li>Manage recruiting company profiles and drive workflows</li>
                <li>Monitor overall placement analytics and generate reports</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Settings Sub-tab */}
      {activeSubTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Ecosystem Settings</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Configure global thresholds, recruitment drives, and alerts.</p>
          </div>

          <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>General Configurations</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Global Student Self-Registration</div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Allow students to register and submit academic profiles directly.</span>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Auto-Lock Eligibility Criteria</div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Automatically match student profiles against job requirements.</span>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Resume Parsing Assistant</div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Use AI to extract and index skills from uploaded resumes.</span>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Notification Preferences</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Email Alerts for New Applications</div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Send notification emails when a candidate applies to a drive.</span>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Weekly Analytics Digest</div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Email summary report to Placement Officers and HODs.</span>
                  </div>
                  <input type="checkbox" defaultChecked={false} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
            
            <button style={{ alignSelf: 'flex-end', padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              Save Configurations
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
