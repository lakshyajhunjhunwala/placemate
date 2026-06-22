import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const useMongo = !!process.env.MONGODB_URI;

// ---------------- MongoDB/Mongoose Mode ----------------
const defineMongoModels = () => {
  // User Schema
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'officer', 'hod'], required: true }
  }, { timestamps: true });

  // Student Profile Schema
  const studentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, default: 'Not set' },
    registerNo: { type: String, default: '' },
    cgpa: { type: Number, default: null },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    skills: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    verified: { type: Boolean, default: false },
    profileStatus: { type: String, enum: ['PENDING', 'SUBMITTED', 'VERIFIED'], default: 'PENDING' },
    placementStatus: { type: String, enum: ['PLACED', 'NOT PLACED'], default: 'NOT PLACED' },
    readinessScore: { type: Number, default: 0 }
  }, { timestamps: true });

  // Company Schema
  const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    sector: { type: String, default: '' },
    avgPackage: { type: String, default: '' },
    hiredCount: { type: Number, default: 0 }
  }, { timestamps: true });

  // Job Listing Schema
  const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, enum: ['Job', 'Internship'], default: 'Job' },
    package: { type: String, default: '' },
    minCgpa: { type: Number, default: 0 },
    departments: { type: [String], default: ['All'] },
    skillsRequired: { type: [String], default: [] },
    description: { type: String, default: '' },
    location: { type: String, default: '' }
  }, { timestamps: true });

  // Application Schema
  const applicationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    stage: { type: String, default: 'Applied' },
    date: { type: String, required: true }
  }, { timestamps: true });

  // Discussion Forum Schema
  const discussionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, default: '' },
    category: { type: String, default: 'Interview Experience' },
    content: { type: String, default: '' },
    user: { type: String, default: 'Anonymous' },
    date: { type: String, required: true }
  }, { timestamps: true });

  // Resume Schema
  const resumeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    primary: { type: Boolean, default: false }
  }, { timestamps: true });

  // Notification Schema
  const notificationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
  }, { timestamps: true });

  return {
    User: mongoose.model('User', userSchema),
    Student: mongoose.model('Student', studentSchema),
    Company: mongoose.model('Company', companySchema),
    Job: mongoose.model('Job', jobSchema),
    Application: mongoose.model('Application', applicationSchema),
    Discussion: mongoose.model('Discussion', discussionSchema),
    Resume: mongoose.model('Resume', resumeSchema),
    Notification: mongoose.model('Notification', notificationSchema)
  };
};

// ---------------- Mock Local Database Mode ----------------
const DB_FILE = path.resolve('db.json');

const initDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      users: [],
      students: [],
      companies: [],
      jobs: [],
      applications: [],
      discussions: [],
      resumes: [],
      notifications: []
    }, null, 2));
  }
};

const readDb = () => {
  initDb();
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    return {
      users: [],
      students: [],
      companies: [],
      jobs: [],
      applications: [],
      discussions: [],
      resumes: [],
      notifications: []
    };
  }
};

const writeDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

class MockModel {
  constructor(collectionName) {
    this.coll = collectionName;
  }

  async deleteMany() {
    const db = readDb();
    db[this.coll] = [];
    writeDb(db);
    return { deletedCount: 0 };
  }

  async countDocuments(query = {}) {
    const items = await this._findRaw(query);
    return items.length;
  }

  async create(data) {
    const db = readDb();
    const newItem = {
      _id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    db[this.coll].push(newItem);
    writeDb(db);
    return this._wrap(newItem);
  }

  async insertMany(arr) {
    const db = readDb();
    const created = arr.map(item => ({
      _id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    }));
    db[this.coll].push(...created);
    writeDb(db);
    return created.map(item => this._wrap(item));
  }

  async _findRaw(query = {}) {
    const db = readDb();
    const items = db[this.coll] || [];
    return items.filter(item => {
      for (const key in query) {
        const queryVal = query[key];
        const itemVal = item[key];
        if (queryVal && typeof queryVal === 'object' && queryVal.toString) {
          if (queryVal.toString() !== (itemVal && itemVal.toString())) return false;
        } else if (itemVal !== queryVal) {
          return false;
        }
      }
      return true;
    });
  }

  find(query = {}) {
    const self = this;
    const db = readDb();
    let currentPromise = this._findRaw(query).then(items => items.map(item => self._wrap(item)));

    const chain = {
      populate: function(pathOpts) {
        currentPromise = currentPromise.then(wrappedItems => {
          const path = typeof pathOpts === 'string' ? pathOpts : pathOpts.path;
          wrappedItems.forEach(w => {
            if (path === 'userId' && w.userId) {
              const users = db.users || [];
              const user = users.find(u => u._id === w.userId.toString() || u._id === w.userId);
              if (user) w.userId = user;
            }
            if (path === 'jobId' && w.jobId) {
              const jobs = db.jobs || [];
              const job = jobs.find(j => j._id === w.jobId.toString() || j._id === w.jobId);
              if (job) w.jobId = job;
            }
            if (path === 'studentId' && w.studentId) {
              const students = db.students || [];
              const student = students.find(s => s._id === w.studentId.toString() || s._id === w.studentId);
              if (student) {
                w.studentId = student;
                if (pathOpts.populate && pathOpts.populate.path === 'userId') {
                  const users = db.users || [];
                  const user = users.find(u => u._id === student.userId.toString() || u._id === student.userId);
                  if (user) w.studentId.userId = user;
                }
              }
            }
          });
          return wrappedItems;
        });
        return chain;
      },
      sort: function(sortObj) {
        currentPromise = currentPromise.then(wrappedItems => {
          if (sortObj && sortObj.createdAt === -1) {
            wrappedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }
          return wrappedItems;
        });
        return chain;
      },
      then: function(resolve, reject) {
        return currentPromise.then(resolve, reject);
      },
      catch: function(reject) {
        return currentPromise.catch(reject);
      }
    };
    return chain;
  }

  async findOne(query = {}) {
    const items = await this._findRaw(query);
    return items.length > 0 ? this._wrap(items[0]) : null;
  }

  async findById(id) {
    if (!id) return null;
    const items = await this._findRaw({ _id: id.toString() });
    return items.length > 0 ? this._wrap(items[0]) : null;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    if (!id) return null;
    const db = readDb();
    const items = db[this.coll] || [];
    const idx = items.findIndex(item => item._id === id.toString());
    if (idx === -1) return null;

    let updatedItem = { ...items[idx], updatedAt: new Date().toISOString() };
    
    // Support Mongoose $inc operator
    if (update.$inc) {
      for (const k in update.$inc) {
        updatedItem[k] = (updatedItem[k] || 0) + update.$inc[k];
      }
    } else {
      updatedItem = { ...updatedItem, ...update };
    }
    
    db[this.coll][idx] = updatedItem;
    writeDb(db);
    return this._wrap(updatedItem);
  }

  async findOneAndUpdate(query, update, options = {}) {
    const items = await this._findRaw(query);
    if (items.length === 0) return null;
    return this.findByIdAndUpdate(items[0]._id, update, options);
  }

  async findOneAndDelete(query) {
    const db = readDb();
    const items = db[this.coll] || [];
    const idx = items.findIndex(item => {
      for (const key in query) {
        const queryVal = query[key];
        const itemVal = item[key];
        if (queryVal && typeof queryVal === 'object' && queryVal.toString) {
          if (queryVal.toString() !== (itemVal && itemVal.toString())) return false;
        } else if (itemVal !== queryVal) {
          return false;
        }
      }
      return true;
    });

    if (idx === -1) return null;
    const deleted = items[idx];
    db[this.coll].splice(idx, 1);
    writeDb(db);
    return this._wrap(deleted);
  }

  async updateMany(query, update) {
    const db = readDb();
    const items = db[this.coll] || [];
    let count = 0;
    items.forEach((item, idx) => {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        db[this.coll][idx] = { ...item, ...update, updatedAt: new Date().toISOString() };
        count++;
      }
    });
    if (count > 0) writeDb(db);
    return { nModified: count };
  }

  _wrap(item) {
    if (!item) return item;
    const self = this;
    const wrapped = {
      ...item,
      toObject: () => item,
      save: async function() {
        const db = readDb();
        const items = db[self.coll] || [];
        const idx = items.findIndex(x => x._id === item._id);
        const toSave = { ...this, updatedAt: new Date().toISOString() };
        // Clean wrapping helpers before saving
        delete toSave.save;
        delete toSave.toObject;
        
        if (idx !== -1) {
          db[self.coll][idx] = toSave;
        } else {
          toSave.createdAt = new Date().toISOString();
          db[self.coll].push(toSave);
        }
        writeDb(db);
        return self._wrap(toSave);
      }
    };
    return wrapped;
  }
}

// ---------------- Export Controller ----------------
let exportsObj;

if (useMongo) {
  exportsObj = defineMongoModels();
} else {
  console.log("⚠️ MONGODB_URI not set. Running in Local JSON Database Mode. Data will be saved to server/db.json");
  exportsObj = {
    User: new MockModel('users'),
    Student: new MockModel('students'),
    Company: new MockModel('companies'),
    Job: new MockModel('jobs'),
    Application: new MockModel('applications'),
    Discussion: new MockModel('discussions'),
    Resume: new MockModel('resumes'),
    Notification: new MockModel('notifications')
  };
}

export const { User, Student, Company, Job, Application, Discussion, Resume, Notification } = exportsObj;
