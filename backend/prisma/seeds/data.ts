export const colleges = [
    { name: 'Stanford University', city: 'Stanford', state: 'CA', country: 'USA', website: 'https://stanford.edu' },
    { name: 'MIT', city: 'Cambridge', state: 'MA', country: 'USA', website: 'https://mit.edu' },
    { name: 'Harvard University', city: 'Cambridge', state: 'MA', country: 'USA', website: 'https://harvard.edu' },
    { name: 'Caltech', city: 'Pasadena', state: 'CA', country: 'USA', website: 'https://caltech.edu' },
    { name: 'Oxford University', city: 'Oxford', country: 'UK', website: 'https://ox.ac.uk' },
    { name: 'Cambridge University', city: 'Cambridge', country: 'UK', website: 'https://cam.ac.uk' },
    { name: 'ETH Zurich', city: 'Zurich', country: 'Switzerland', website: 'https://ethz.ch' },
    { name: 'University of Toronto', city: 'Toronto', country: 'Canada', website: 'https://utoronto.ca' },
    { name: 'National University of Singapore', city: 'Singapore', country: 'Singapore', website: 'https://nus.edu.sg' },
    { name: 'Tsinghua University', city: 'Beijing', country: 'China', website: 'https://tsinghua.edu.cn' },
];

export const trainers = [
    { name: 'Alice Johnson', email: 'alice@example.com', skills: ['Python', 'Data Science', 'Machine Learning'], hourlyRate: 80, location: 'New York, NY', bio: 'Expert in AI.' },
    { name: 'Bob Smith', email: 'bob@example.com', skills: ['Java', 'Spring Boot', 'Microservices'], hourlyRate: 70, location: 'San Francisco, CA', bio: 'Backend specialist.' },
    { name: 'Charlie Brown', email: 'charlie@example.com', skills: ['React', 'Next.js', 'TypeScript'], hourlyRate: 60, location: 'Austin, TX', bio: 'Frontend guru.' },
    { name: 'Diana Prince', email: 'diana@example.com', skills: ['AWS', 'Cloud Computing', 'DevOps'], hourlyRate: 90, location: 'Seattle, WA', bio: 'Cloud architect.' },
    { name: 'Evan Wright', email: 'evan@example.com', skills: ['Cybersecurity', 'Ethical Hacking'], hourlyRate: 85, location: 'Chicago, IL', bio: 'Security expert.' },
    { name: 'Fiona Gallagher', email: 'fiona@example.com', skills: ['UI/UX Design', 'Figma'], hourlyRate: 55, location: 'Los Angeles, CA', bio: 'Creative designer.' },
    { name: 'George Miller', email: 'george@example.com', skills: ['C++', 'Embedded Systems'], hourlyRate: 75, location: 'Boston, MA', bio: 'Systems engineer.' },
    { name: 'Hannah Lee', email: 'hannah@example.com', skills: ['Mobile Dev', 'Flutter', 'Dart'], hourlyRate: 65, location: 'Denver, CO', bio: 'Mobile app developer.' },
    { name: 'Ian Scott', email: 'ian@example.com', skills: ['Blockchain', 'Solidity'], hourlyRate: 95, location: 'Miami, FL', bio: 'Web3 enthusiast.' },
    { name: 'Julia Roberts', email: 'julia@example.com', skills: ['Project Management', 'Agile'], hourlyRate: 50, location: 'Atlanta, GA', bio: 'Scrum master.' },
];

export const requirements = [
    { title: 'Python Bootcamp', description: 'Intensive Python course for beginners.', tags: ['Python', 'Data Science'], budgetMin: 50, budgetMax: 100, startDate: new Date('2024-01-10'), endDate: new Date('2024-01-20'), status: 'PUBLISHED' },
    { title: 'Java Advanced', description: 'Deep dive into Java concurrency.', tags: ['Java', 'Threading'], budgetMin: 60, budgetMax: 120, startDate: new Date('2024-02-01'), endDate: new Date('2024-02-15'), status: 'PUBLISHED' },
    { title: 'React Workshop', description: 'Hands-on React training.', tags: ['React', 'Frontend'], budgetMin: 40, budgetMax: 80, startDate: new Date('2024-03-05'), endDate: new Date('2024-03-07'), status: 'COMPLETED' },
    { title: 'AWS Certification Prep', description: 'Prepare students for AWS Solutions Architect.', tags: ['AWS', 'Cloud'], budgetMin: 80, budgetMax: 150, startDate: new Date('2024-04-10'), endDate: new Date('2024-04-30'), status: 'PUBLISHED' },
    { title: 'Cybersecurity 101', description: 'Basics of network security.', tags: ['Cybersecurity', 'Network'], budgetMin: 70, budgetMax: 100, startDate: new Date('2024-05-01'), endDate: new Date('2024-05-05'), status: 'PUBLISHED' },
    { title: 'Mobile App Dev', description: 'Build your first Flutter app.', tags: ['Flutter', 'Mobile'], budgetMin: 50, budgetMax: 90, startDate: new Date('2024-06-01'), endDate: new Date('2024-06-15'), status: 'DRAFT' },
    { title: 'Data Structures & Algo', description: 'Ace technical interviews.', tags: ['DSA', 'C++'], budgetMin: 60, budgetMax: 110, startDate: new Date('2024-07-01'), endDate: new Date('2024-07-20'), status: 'PUBLISHED' },
    { title: 'Blockchain Basics', description: 'Intro to Web3 and Smart Contracts.', tags: ['Blockchain'], budgetMin: 90, budgetMax: 160, startDate: new Date('2024-08-01'), endDate: new Date('2024-08-05'), status: 'PUBLISHED' },
    { title: 'Agile Methodologies', description: 'Agile for software teams.', tags: ['Agile', 'Scrum'], budgetMin: 40, budgetMax: 70, startDate: new Date('2024-09-01'), endDate: new Date('2024-09-02'), status: 'COMPLETED' },
    { title: 'Machine Learning A-Z', description: 'Comprehensive ML course.', tags: ['Machine Learning', 'Python'], budgetMin: 80, budgetMax: 140, startDate: new Date('2024-10-01'), endDate: new Date('2024-10-30'), status: 'PUBLISHED' },
];

export const sessions = [
    { title: 'Intro to Python', status: 'COMPLETED', startTime: new Date('2023-12-01T10:00:00Z'), endTime: new Date('2023-12-01T12:00:00Z'), location: 'Room 101' },
    { title: 'Data Types & Variables', status: 'COMPLETED', startTime: new Date('2023-12-03T10:00:00Z'), endTime: new Date('2023-12-03T12:00:00Z'), location: 'Room 101' },
    { title: 'Control Flow', status: 'SCHEDULED', startTime: new Date('2024-01-12T10:00:00Z'), endTime: new Date('2024-01-12T12:00:00Z'), location: 'Lab 2' },
    { title: 'Functions & Modules', status: 'SCHEDULED', startTime: new Date('2024-01-14T10:00:00Z'), endTime: new Date('2024-01-14T12:00:00Z'), location: 'Lab 2' },
    { title: 'Canceled Session', status: 'CANCELLED', startTime: new Date('2024-01-15T10:00:00Z'), endTime: new Date('2024-01-15T12:00:00Z'), location: 'Lab 2' },
    { title: 'Java OOP', status: 'SCHEDULED', startTime: new Date('2024-02-02T09:00:00Z'), endTime: new Date('2024-02-02T11:00:00Z'), location: 'Online' },
    { title: 'Spring Boot Setup', status: 'SCHEDULED', startTime: new Date('2024-02-04T09:00:00Z'), endTime: new Date('2024-02-04T11:00:00Z'), location: 'Online' },
    { title: 'AWS EC2 Basics', status: 'SCHEDULED', startTime: new Date('2024-04-12T14:00:00Z'), endTime: new Date('2024-04-12T16:00:00Z'), location: 'Virtual' },
    { title: 'S3 & Storage', status: 'SCHEDULED', startTime: new Date('2024-04-14T14:00:00Z'), endTime: new Date('2024-04-14T16:00:00Z'), location: 'Virtual' },
    { title: 'Final Project Review', status: 'SCHEDULED', startTime: new Date('2024-10-30T10:00:00Z'), endTime: new Date('2024-10-30T13:00:00Z'), location: 'Main Hall' },
];

export const documents = [
    { title: 'Q1 Training Proposal', type: 'PROPOSAL', folder: 'Proposals' },
    { title: 'Invoice #1001', type: 'INVOICE', folder: 'Invoices' },
    { title: 'Stanford Compliance Doc', type: 'CONTRACT', folder: 'Stanford University' },
    { title: 'MIT NDA', type: 'CONTRACT', folder: 'MIT' },
    { title: 'Q2 Roadmap', type: 'REPORT', folder: 'Reports' },
    { title: 'Training Materials v1', type: 'OTHER', folder: 'Materials' },
    { title: 'Trainer Agreement', type: 'CONTRACT', folder: 'HR' },
    { title: 'Feedback Summary Jan', type: 'REPORT', folder: 'Reports' },
    { title: 'Budget Approval', type: 'OTHER', folder: 'Finance' },
    { title: 'Project Plan', type: 'PROPOSAL', folder: 'Stanford University' },
];
