import mongoose from 'mongoose';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Opportunity from '../models/Opportunity.js';
import LearningResource from '../models/LearningResource.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';

export const seedInitialData = async () => {
  try {
    const existingSkills = await Skill.countDocuments();
    if (existingSkills > 0) {
      console.log('⚡ Database already seeded. Skipping initial seed.');
      return;
    }

    console.log('🌱 Seeding initial OpenPath data catalog...');

    // 1. Seed Skills
    const skillsData = [
      { name: 'React', category: 'Frontend', description: 'Component-based UI library for web development' },
      { name: 'JavaScript', category: 'Programming', description: 'Core web scripting language (ES6+)' },
      { name: 'TypeScript', category: 'Programming', description: 'Typed superset of JavaScript' },
      { name: 'Node.js', category: 'Backend', description: 'Server-side JavaScript runtime environment' },
      { name: 'Express.js', category: 'Backend', description: 'Minimalist web application framework for Node.js' },
      { name: 'MongoDB', category: 'Database', description: 'Document-oriented NoSQL database system' },
      { name: 'SQL', category: 'Database', description: 'Relational database query language' },
      { name: 'Python', category: 'Programming', description: 'High-level language widely used in AI, ML & backend' },
      { name: 'Machine Learning', category: 'Data & AI', description: 'Statistical algorithms and predictive modeling' },
      { name: 'Figma', category: 'Design', description: 'Collaborative web-based UI/UX design tool' },
      { name: 'UI/UX Design', category: 'Design', description: 'User research, wireframing, and visual interfaces' },
      { name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS framework for rapid styling' },
      { name: 'Git', category: 'DevOps & Tools', description: 'Distributed version control and collaboration' },
      { name: 'REST APIs', category: 'Backend', description: 'Standard HTTP communication architecture' },
      { name: 'Docker', category: 'DevOps & Tools', description: 'Containerization and environment reproducibility' },
      { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud computing infrastructure' },
      { name: 'Data Structures', category: 'Computer Science', description: 'Fundamental algorithms and problem solving' },
      { name: 'HTML & CSS', category: 'Frontend', description: 'Core building blocks of the responsive web' },
      { name: 'GraphQL', category: 'Backend', description: 'Query language for APIs and runtime executor' },
      { name: 'Next.js', category: 'Frontend', description: 'Full-stack React framework with SSR and SSG' },
    ];

    const createdSkills = await Skill.insertMany(skillsData);
    const skillMap = {};
    createdSkills.forEach((s) => {
      skillMap[s.name] = s._id;
    });

    // 2. Seed Users (Demo Student and Demo Employer)
    const demoStudent = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      password: 'password123',
      role: 'student',
      bio: 'Pre-final year Computer Science undergraduate passionate about building accessible user interfaces and modern web applications.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      resumeUrl: 'https://openpath.internal/resumes/alex_rivera_resume.pdf',
      education: {
        degree: 'Bachelor of Technology (B.Tech)',
        institution: 'Indian Institute of Information Technology',
        fieldOfStudy: 'Computer Science & Engineering',
        startYear: '2022',
        endYear: '2026',
        grade: '8.8 CGPA',
      },
      skills: [
        skillMap['React'],
        skillMap['JavaScript'],
        skillMap['HTML & CSS'],
        skillMap['Tailwind CSS'],
        skillMap['Git'],
        skillMap['REST APIs'],
      ],
      interests: ['Frontend Engineering', 'UI/UX Design', 'Full-stack Web Development', 'Open Source'],
      experience: {
        role: 'Frontend Contributor',
        organization: 'Campus Open Source Guild',
        duration: '6 Months',
        description: 'Built interactive dashboards and automated form components using React and REST APIs.',
      },
      location: {
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        remotePreference: 'Remote',
      },
      profileCompleted: true,
    });

    const demoEmployer = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@techcorp.io',
      password: 'password123',
      role: 'employer',
      bio: 'Head of University Relations & Early Career Talent at TechCorp Labs.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      companyDetails: {
        companyName: 'TechCorp Labs',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
        industry: 'Cloud Software & Developer Tools',
        description: 'TechCorp builds next-generation productivity infrastructure for teams worldwide.',
        website: 'https://techcorp.io',
        hiringTypes: ['Internship', 'Apprenticeship', 'Entry-level Job'],
      },
      location: {
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
      },
      profileCompleted: true,
    });

    // 3. Seed Learning Resources mapped to skills
    const learningData = [
      {
        title: 'Node.js & Express Fundamentals',
        description: 'Master backend server development, routing, middleware, and database connectivity.',
        skill: skillMap['Node.js'],
        type: 'Course',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs',
        provider: 'MDN Web Docs',
        difficulty: 'Beginner',
        estimatedDuration: '4 hours',
        roadmapStage: 'Beginner',
      },
      {
        title: 'MongoDB Schema Design & Query Optimization',
        description: 'Learn document modeling, indexing strategies, and aggregation pipelines.',
        skill: skillMap['MongoDB'],
        type: 'Documentation',
        url: 'https://www.mongodb.com/developer/products/mongodb/schema-design-best-practices/',
        provider: 'MongoDB University',
        difficulty: 'Intermediate',
        estimatedDuration: '3 hours',
        roadmapStage: 'Practice',
      },
      {
        title: 'TypeScript for JavaScript Developers',
        description: 'Understand static typing, generics, interfaces, and strict type safety.',
        skill: skillMap['TypeScript'],
        type: 'Course',
        url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
        provider: 'TypeScript Official',
        difficulty: 'Beginner',
        estimatedDuration: '2 hours',
        roadmapStage: 'Beginner',
      },
      {
        title: 'Complete Docker Hands-On for Beginners',
        description: 'Build container images, run microservices with docker-compose, and manage ports.',
        skill: skillMap['Docker'],
        type: 'Video',
        url: 'https://docs.docker.com/get-started/',
        provider: 'Docker Labs',
        difficulty: 'Intermediate',
        estimatedDuration: '3.5 hours',
        roadmapStage: 'Practice',
      },
      {
        title: 'Modern UI/UX Design with Figma',
        description: 'Wireframing, typography hierarchies, auto-layout, design tokens and prototyping.',
        skill: skillMap['Figma'],
        type: 'Course',
        url: 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-design',
        provider: 'Figma Community Academy',
        difficulty: 'Beginner',
        estimatedDuration: '5 hours',
        roadmapStage: 'Project',
      },
      {
        title: 'Practical Machine Learning with Scikit-Learn',
        description: 'Data preprocessing, feature engineering, classification, and evaluation metrics.',
        skill: skillMap['Machine Learning'],
        type: 'Article',
        url: 'https://scikit-learn.org/stable/tutorial/basic/tutorial.html',
        provider: 'Scikit-Learn Docs',
        difficulty: 'Advanced',
        estimatedDuration: '6 hours',
        roadmapStage: 'Ready',
      },
      {
        title: 'Building Production REST APIs with Authentication',
        description: 'JWT token lifecycle, password hashing with bcrypt, input validation, and HTTP security.',
        skill: skillMap['REST APIs'],
        type: 'Course',
        url: 'https://expressjs.com/en/guide/routing.html',
        provider: 'OpenPath Engineering',
        difficulty: 'Intermediate',
        estimatedDuration: '3 hours',
        roadmapStage: 'Practice',
      },
      {
        title: 'AWS Cloud Practitioner Essentials',
        description: 'Cloud concepts, security architecture, IAM roles, S3 buckets, and EC2 instances.',
        skill: skillMap['AWS'],
        type: 'Course',
        url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
        provider: 'AWS Skill Builder',
        difficulty: 'Intermediate',
        estimatedDuration: '6 hours',
        roadmapStage: 'Ready',
      },
    ];

    await LearningResource.insertMany(learningData);

    // 4. Seed Opportunities
    const opportunitiesData = [
      {
        title: 'Frontend Engineering Intern',
        organization: 'TechCorp Labs',
        organizationLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
        type: 'Internship',
        requiredSkills: [
          skillMap['React'],
          skillMap['JavaScript'],
          skillMap['Tailwind CSS'],
          skillMap['REST APIs'],
          skillMap['Git'],
        ],
        qualification: {
          degree: 'Bachelor of Technology (B.Tech)',
          field: 'Computer Science or IT',
          minCgpa: 7.0,
        },
        experienceRequired: {
          minYears: 0,
          level: 'Fresher / Student',
        },
        location: {
          type: 'Remote',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
        },
        interests: ['Frontend Engineering', 'UI/UX Design', 'Full-stack Web Development'],
        salary: {
          amount: '₹35,000',
          period: 'month',
          currency: '₹',
          isUnpaid: false,
        },
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdBy: demoEmployer._id,
        status: 'Active',
        description:
          'Join our frontend core team to build accessible, high-performance web interfaces used by over 500,000 developers. You will collaborate with senior engineers and product designers on real production features.',
        responsibilities: [
          'Develop reusable React UI components following our design system',
          'Integrate REST endpoints and manage local UI states',
          'Write clean semantic HTML and responsive CSS layouts',
          'Participate in code reviews and pair programming sessions',
        ],
        requirements: [
          'Solid understanding of React fundamentals, hooks, and JavaScript ES6+',
          'Familiarity with Git branching and pull requests',
          'Eagerness to learn in a supportive collaborative engineering culture',
        ],
      },
      {
        title: 'Junior Full-Stack Developer',
        organization: 'TechCorp Labs',
        organizationLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200',
        type: 'Entry-level Job',
        requiredSkills: [
          skillMap['React'],
          skillMap['Node.js'],
          skillMap['MongoDB'],
          skillMap['REST APIs'],
          skillMap['Docker'],
        ],
        qualification: {
          degree: 'B.Tech / BCA / B.Sc',
          field: 'Computer Science',
          minCgpa: 6.5,
        },
        experienceRequired: {
          minYears: 0,
          level: '0 - 1 years (Freshers eligible)',
        },
        location: {
          type: 'Hybrid',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
        },
        interests: ['Full-stack Web Development', 'Backend Engineering'],
        salary: {
          amount: '₹8,50,000',
          period: 'year',
          currency: '₹',
          isUnpaid: false,
        },
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        createdBy: demoEmployer._id,
        status: 'Active',
        description:
          'We are seeking an ambitious Junior Full-Stack Developer to work across our Node.js APIs and React frontends. You will touch real database schemas, API optimizations, and microservices.',
        responsibilities: [
          'Build RESTful API endpoints and secure authentication flows with Express.js',
          'Implement interactive React dashboards and user workflows',
          'Model Mongoose schemas and optimize database queries',
          'Deploy services using Docker containers',
        ],
        requirements: [
          'Experience building full-stack projects using React and Node.js',
          'Knowledge of NoSQL database operations',
          'Strong problem solving and architectural curiosity',
        ],
      },
      {
        title: 'Product Design & UI/UX Apprentice',
        organization: 'PixelCraft Studio',
        organizationLogo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=200',
        type: 'Apprenticeship',
        requiredSkills: [
          skillMap['Figma'],
          skillMap['UI/UX Design'],
          skillMap['HTML & CSS'],
        ],
        qualification: {
          degree: 'Any Graduate or Diploma',
          field: 'Design, Arts, or Engineering',
          minCgpa: 0,
        },
        experienceRequired: {
          minYears: 0,
          level: 'Fresher / Enthusiast',
        },
        location: {
          type: 'Remote',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
        },
        interests: ['UI/UX Design', 'Product Management'],
        salary: {
          amount: '₹22,000',
          period: 'month',
          currency: '₹',
          isUnpaid: false,
        },
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        createdBy: demoEmployer._id,
        status: 'Active',
        description:
          'A paid apprenticeship designed for passionate visual and interaction designers. Learn user research, design token systems, and design handoff while crafting consumer experiences.',
        responsibilities: [
          'Create high-fidelity wireframes and interactive prototypes in Figma',
          'Conduct usability feedback interviews with early adopters',
          'Maintain component library and token specifications',
        ],
        requirements: [
          'Portfolio with at least 2 mobile or web UI concept case studies',
          'Proficiency with Figma components, auto-layout, and styles',
        ],
      },
      {
        title: 'AI & Data Science Trainee',
        organization: 'DeepSense Analytics',
        organizationLogo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=200',
        type: 'Internship',
        requiredSkills: [
          skillMap['Python'],
          skillMap['Machine Learning'],
          skillMap['SQL'],
          skillMap['Data Structures'],
        ],
        qualification: {
          degree: 'B.Tech / M.Tech / M.Sc',
          field: 'Data Science / AI / CS / Math',
          minCgpa: 7.5,
        },
        experienceRequired: {
          minYears: 0,
          level: 'Student / Fresher',
        },
        location: {
          type: 'On-site',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
        },
        interests: ['Artificial Intelligence', 'Data Science', 'Machine Learning'],
        salary: {
          amount: '₹40,000',
          period: 'month',
          currency: '₹',
          isUnpaid: false,
        },
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        createdBy: demoEmployer._id,
        status: 'Active',
        description:
          'DeepSense is looking for high-curiosity student trainees to contribute to machine learning pipelines, structured ETL processes, and predictive analytics models.',
        responsibilities: [
          'Perform exploratory data analysis (EDA) and data cleansing in Python',
          'Build baseline classification and regression models',
          'Benchmark model performance metrics against business KPIs',
        ],
        requirements: [
          'Proficient in Python and mathematical foundations of ML',
          'Working knowledge of SQL joins and data extraction',
        ],
      },
      {
        title: 'Cloud DevOps & Platform Trainee',
        organization: 'TechCorp Labs',
        organizationLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
        type: 'Apprenticeship',
        requiredSkills: [
          skillMap['Docker'],
          skillMap['AWS'],
          skillMap['Git'],
          skillMap['Node.js'],
        ],
        qualification: {
          degree: 'B.Tech / BCA',
          field: 'Computer Science or IT',
          minCgpa: 6.0,
        },
        experienceRequired: {
          minYears: 0,
          level: 'Fresher',
        },
        location: {
          type: 'Remote',
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
        },
        interests: ['Cloud Computing', 'DevOps', 'Infrastructure'],
        salary: {
          amount: '₹30,000',
          period: 'month',
          currency: '₹',
          isUnpaid: false,
        },
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        createdBy: demoEmployer._id,
        status: 'Active',
        description:
          'Learn how continuous deployment works at scale. Work with modern CI/CD pipelines, container orchestration, and multi-region AWS cloud deployments.',
        responsibilities: [
          'Assist in containerizing backend web applications with Docker',
          'Write GitHub Actions automation workflows',
          'Monitor server logs and system health telemetry',
        ],
        requirements: [
          'Familiarity with basic Linux commands and Git',
          'Interest in cloud architectures and infrastructure automation',
        ],
      },
      {
        title: 'Full Stack Web Apprenticeship',
        organization: 'NextGen Innovations',
        organizationLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200',
        type: 'Apprenticeship',
        requiredSkills: [
          skillMap['JavaScript'],
          skillMap['React'],
          skillMap['HTML & CSS'],
          skillMap['REST APIs'],
        ],
        qualification: {
          degree: 'Any Graduate / Fresher',
          field: 'Any',
          minCgpa: 0,
        },
        experienceRequired: {
          minYears: 0,
          level: 'Fresher / Career Changer',
        },
        location: {
          type: 'Remote',
          city: 'Delhi NCR',
          state: 'Delhi',
          country: 'India',
        },
        interests: ['Web Development', 'Frontend Engineering'],
        salary: {
          amount: '₹25,000',
          period: 'month',
          currency: '₹',
          isUnpaid: false,
        },
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        createdBy: demoEmployer._id,
        status: 'Active',
        description:
          'A 6-month hands-on apprenticeship program pairing freshers with seasoned tech leads to transition directly into high-growth startup roles.',
        responsibilities: [
          'Build customer-facing pages in React',
          'Fix responsiveness bugs across mobile, tablet, and desktop',
          'Connect forms to backend validation services',
        ],
        requirements: [
          'Passion for web software and clean design',
          'Basic proficiency in HTML, CSS, and modern JavaScript',
        ],
      },
    ];

    const createdOpportunities = await Opportunity.insertMany(opportunitiesData);

    // 5. Seed Pre-existing Applications for Demo Student
    const sampleApp1 = await Application.create({
      user: demoStudent._id,
      opportunity: createdOpportunities[0]._id, // Frontend Engineering Intern (High match!)
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: 'Strong portfolio projects in React and responsive design.',
      timeline: [
        { stage: 'Applied', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), note: 'Application submitted.' },
        { stage: 'Reviewing', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: 'Profile reviewed by hiring lead.' },
        { stage: 'Shortlisted', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Candidate shortlisted for interview.' },
      ],
      interviewDetails: {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '11:00 AM IST',
        type: 'Virtual Video Call',
        location: 'Google Meet',
        link: 'https://meet.google.com/opn-path-demo',
      },
    });

    const sampleApp2 = await Application.create({
      user: demoStudent._id,
      opportunity: createdOpportunities[1]._id, // Junior Full-Stack Developer
      status: 'Reviewing',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      notes: 'Submitted resume and GitHub profile.',
      timeline: [
        { stage: 'Applied', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Application received.' },
        { stage: 'Reviewing', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Under technical review.' },
      ],
    });

    // 6. Seed Notifications for Student
    await Notification.create([
      {
        user: demoStudent._id,
        type: 'application_status',
        title: 'Application Shortlisted! 🎉',
        message: 'TechCorp Labs shortlisted your application for Frontend Engineering Intern.',
        relatedOpportunity: createdOpportunities[0]._id,
        relatedApplication: sampleApp1._id,
        isRead: false,
      },
      {
        user: demoStudent._id,
        type: 'opportunity',
        title: 'New High Match Opportunity',
        message: 'Junior Full-Stack Developer at TechCorp Labs aligns with 85% of your skills!',
        relatedOpportunity: createdOpportunities[1]._id,
        isRead: true,
      },
    ]);

    console.log('✅ OpenPath data successfully seeded!');
    console.log(`👤 Student: alex.rivera@university.edu / password123`);
    console.log(`💼 Employer: recruiter@techcorp.io / password123`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
};

// If run directly via "node src/config/seed.js"
if (process.argv[1]?.endsWith('seed.js')) {
  const { connectDB } = await import('./db.js');
  await connectDB();
  await seedInitialData();
  process.exit(0);
}
