const checkNotEmpty = (field, fieldName) => {
  if (!field || (typeof field === "string" && field.trim() === "")) {
    throw new Error(`${fieldName} is required!`);
  }
};

const checkEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format!");
  }
};

const checkPasswordLength = (password) => {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long!");
  }
};

const checkPlanIdValid = (planId) => {
  if (!Number.isInteger(planId) || planId < 1 || planId > 3) {
    throw new Error("Invalid plan id!");
  }
};

const checkOTPValid = (otpCode) => {
  if (typeof otpCode !== 'string' || otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
    throw new Error("OTP must be a 6-digit string!");
  }
};

const checkMovieStatusValid = (status) => {
  if (!Number.isInteger(status) || status < 1 || status > 3) {
    throw new Error("Invalid movie status!");
  }
};

const checkMovieReleaseYearValid = (year) => {
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    throw new Error("Release year must be a 4-digit number!");
  }
};

const checkVideoNotEmpty = (file, fieldName) => {
  if (!file) {
    throw new Error(`${fieldName} is required!`);
  }
};

const checkImageNotEmpty = (files, fieldName) => { 
  if (!files?.[fieldName]?.length) { 
    throw new Error(`${fieldName} is required!`); 
  } 
};

const checkGenresValid = (field, fieldName) => {
  if (!field) {
    throw new Error(`${fieldName} is required!`);
  }
  if (!Array.isArray(field)) {
    throw new Error(`${fieldName} must be an array!`);
  }
  if (field.length === 0) {
    throw new Error(`${fieldName} must not be empty!`);
  }
  if (!field.every(Number.isInteger)) {
    throw new Error(`${fieldName} must contain only integers!`);
  }
};

const checkIntegerNumber = (field, fieldName) => {
  if (!Number.isInteger(field)) {
    throw new Error(`${fieldName} must be an integer!`);
  }
};

export {
  checkNotEmpty,
  checkPasswordLength,
  checkEmailValid,
  checkPlanIdValid,
  checkOTPValid,
  checkMovieStatusValid,
  checkMovieReleaseYearValid,
  checkVideoNotEmpty,
  checkImageNotEmpty,
  checkGenresValid,
  checkIntegerNumber
};
