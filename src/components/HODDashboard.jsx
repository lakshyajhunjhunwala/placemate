import React, { useState } from 'react';
import { 
  Building, GraduationCap, TrendingUp, Users, Search, 
  BookOpen, FileText, CheckCircle, Clock, ShieldAlert, Award
} from 'lucide-react';

export default function HODDashboard({
  students,
  companies,
  jobs,
  applications,
  activeSubTab
}) {
  // Assume HOD is for CSE department
  const HOD_DEPT = 'CSE';
  
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Department Filters
  const deptStudents = students.filter(s => s.department === HOD_DEPT);
  
  const placedDeptStudents = deptStudents.filter(s => 
    applications.some(a => a.studentId === s.id && a.stage === 'Selected')
  );
  
  const deptPlacementRate = deptStudents.length > 0 
    ? Math.round((placedDeptStudents.length / deptStudents.length) * 100) 
    : 0;

  // Active drives targeting CSE
  const cseJobs = jobs.filter(j => j.departments.includes('All') || j.departments.includes(HOD_DEPT));

  // Average package calculation for CSE
  const cseAvgPackage = "11.2 LPA";

  return (
    <div className="animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Overview Sub-tab */}
      {activeSubTab === 'overview' && (
        <div>
          {/* Dashboard Cards */}
          <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(99,102,241,0.1)', color: 'hsl(var(--primary))', borderRadius: '12px' }}>
                <Users size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{deptStudents.length}</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>{HOD_DEPT} Candidates</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}>
                <TrendingUp size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{deptPlacementRate}%</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>{HOD_DEPT} Placement Rate</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '12px' }}>
                <Building size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{cseJobs.length}</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Eligible Company Drives</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '12px' }}>
                <Award size={28} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{cseAvgPackage}</div>
                <div style={{ fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Branch Average Package</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', flexWrap: 'wrap' }}>
            {/* Top performing companies for CSE */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Active Department Recruiter Shares</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {companies.map((comp, idx) => (
                  <div key={comp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{comp.name}</div>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Sector: {comp.sector}</span>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 600, color: 'hsl(var(--primary))' }}>{comp.avgPackage} Avg</span>
                      <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>Hired CSE: {Math.max(1, comp.hiredCount - idx)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic training alerts */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={20} style={{ color: '#f59e0b' }} /> Placement Readiness Alerts
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem' }}>
                  <strong>Skills Alert:</strong> 35% of registered CSE students do not have Docker or microservices listed. Recommend setting up a backend bootcamp.
                </div>

                <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '8px', color: '#fde047', fontSize: '0.85rem' }}>
                  <strong>Mock Interviews:</strong> 25 students have scored below 70% on the Placement Readiness Analyzer. Suggest scheduling additional DSA coding drills.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Monitoring Sub-tab */}
      {activeSubTab === 'monitoring' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{HOD_DEPT} Student Progress Tracker</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>Monitor individual student CGPAs, logged skills, and automated readiness indices.</p>
            </div>
            
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'hsl(var(--muted-foreground))' }} />
              <input 
                type="text" 
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{ padding: '10px 12px 10px 36px', background: 'rgba(0,0,0,0.2)', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'white', width: '250px' }}
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px 8px' }}>Student Name</th>
                <th style={{ padding: '12px 8px' }}>CGPA</th>
                <th style={{ padding: '12px 8px' }}>Readiness Score</th>
                <th style={{ padding: '12px 8px' }}>Placement Status</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Dossier Actions</th>
              </tr>
            </thead>
            <tbody>
              {deptStudents
                .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
                .map(stud => {
                  const placed = applications.some(a => a.studentId === stud.id && a.stage === 'Selected');
                  const activeApps = applications.filter(a => a.studentId === stud.id && a.stage !== 'Selected' && a.stage !== 'Rejected').length;
                  
                  return (
                    <tr key={stud.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 600 }}>{stud.name}</td>
                      <td style={{ padding: '16px 8px', color: 'hsl(var(--primary))', fontWeight: 'bold' }}>{stud.cgpa}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600 }}>{stud.readinessScore}%</span>
                          <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${stud.readinessScore}%`, height: '100%', background: stud.readinessScore >= 75 ? '#10b981' : stud.readinessScore >= 50 ? '#f59e0b' : '#ef4444' }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        {placed ? (
                          <span className="badge badge-success">Placed</span>
                        ) : activeApps > 0 ? (
                          <span className="badge badge-primary">{activeApps} Active Drives</span>
                        ) : (
                          <span className="badge badge-warning">Unplaced (Idle)</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <button 
                          className="glass-card" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', color: 'white' }}
                          onClick={() => setSelectedStudent(stud)}
                        >
                          Review Academics
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* HOD Review Drawer */}
          {selectedStudent && (
            <div>
              <div className="backdrop" onClick={() => setSelectedStudent(null)}></div>
              <div className="detail-drawer" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{selectedStudent.name}</h2>
                    <p style={{ color: 'hsl(var(--muted-foreground))' }}>Department Academic Review</p>
                  </div>
                  <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="glass-card" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>CGPA SCALE</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>{selectedStudent.cgpa}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))' }}>READINESS STATUS</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedStudent.readinessScore}%</div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Logged Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedStudent.skills.map((s, i) => (
                        <span key={i} className="badge badge-primary" style={{ textTransform: 'none' }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Project Contributions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedStudent.projects.map((p, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem' }}>{p}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Recruitment History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {applications.filter(a => a.studentId === selectedStudent.id).map(app => {
                        const job = jobs.find(j => j.id === app.jobId);
                        return (
                          <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                            <span>{job?.company} ({job?.title})</span>
                            <span className="badge badge-primary">{app.stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '20px' }}>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    style={{ width: '100%', padding: '12px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics Dashboard Sub-tab with SVG charts */}
      {activeSubTab === 'analytics' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>{HOD_DEPT} Department Statistics Dashboard</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '32px' }}>Granular charts reflecting skill matching and recruitment distributions.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', flexWrap: 'wrap' }}>
            {/* SVG Readiness Ranges Bar Chart */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>CSE Student Readiness Distribution</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Job Ready (>80%)', count: deptStudents.filter(s => s.readinessScore >= 80).length, color: '#10b981' },
                  { label: 'Needs Practice (50-80%)', count: deptStudents.filter(s => s.readinessScore >= 50 && s.readinessScore < 80).length, color: '#f59e0b' },
                  { label: 'Critical Skill Shortage (<50%)', count: deptStudents.filter(s => s.readinessScore < 50).length, color: '#ef4444' }
                ].map((range, i) => {
                  const pct = deptStudents.length > 0 ? Math.round((range.count / deptStudents.length) * 100) : 0;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span>{range.label}</span>
                        <span style={{ fontWeight: 600 }}>{range.count} Students ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: range.color, borderRadius: '5px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SVG Skills distribution bar chart */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>CSE Core Skill Penetration</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { skill: 'React', count: deptStudents.filter(s => s.skills.includes('React')).length },
                  { skill: 'JavaScript', count: deptStudents.filter(s => s.skills.includes('JavaScript')).length },
                  { skill: 'Node.js', count: deptStudents.filter(s => s.skills.includes('Node.js')).length },
                  { skill: 'Java', count: deptStudents.filter(s => s.skills.includes('Java')).length }
                ].map((item, i) => {
                  const pct = deptStudents.length > 0 ? Math.round((item.count / deptStudents.length) * 100) : 0;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span>{item.skill} Developer Share</span>
                        <span style={{ fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', borderRadius: '5px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategic Reporting Sub-tab */}
      {activeSubTab === 'reports' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Strategic HOD Analytics Report</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '24px' }}>Analyze department trends, compare semesters, and export decision support documentation.</p>

          <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Summary of Placement Highlights</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Top recruiter sector</strong>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>Technology & SaaS</span>
              </div>

              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>Target training category</strong>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>DevOps & Microservices</span>
              </div>
            </div>

            <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
              This strategic analysis highlights placement trends for the {HOD_DEPT} branch. The department is showing strong performance with a {deptPlacementRate}% placement rate. However, to maximize super-dream packaging drives (above 15 LPA), specialized bootcamps in System Design and Docker orchestration should be scheduled before the final semester.
            </p>

            <button 
              onClick={() => alert("Report Export Simulated! Downloading CSE-Placement-Dossier-2026.pdf...")}
              style={{ padding: '10px 24px', background: 'hsl(var(--primary))', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Export Strategic Summary (PDF)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
