// Admissions data store - in-memory storage for admission applications
let applications = [];
let applicationIdCounter = 1;

// Generate unique application ID
const generateApplicationId = () => {
  const year = new Date().getFullYear();
  const id = String(applicationIdCounter).padStart(5, '0');
  applicationIdCounter++;
  return `ADM-${year}-${id}`;
};

// Create new application
export const createApplication = (applicationData) => {
  const newApplication = {
    ...applicationData,
    applicationId: generateApplicationId(),
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  applications.push(newApplication);
  return newApplication;
};

// Find application by email
export const findApplicationByEmail = (email) => {
  return applications.find(app => app.email.toLowerCase() === email.toLowerCase());
};

// Find application by ID
export const getApplicationById = (applicationId) => {
  return applications.find(app => app.applicationId === applicationId);
};

// Get all applications
export const getAllApplications = () => {
  return applications;
};

// Get application without sensitive data (if needed)
export const getApplicationWithoutSensitive = (application) => {
  const { ...safeData } = application;
  return safeData;
};
