const checkEmailNotEmpty = (email) => {
  if (!email || email.trim() === "") {
    throw new Error("Email is required!");
  }
};

const checkEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format!");
  }
};

const checkPasswordNotEmpty = (password) => {
  if (!password || password.trim() === "") {
    throw new Error("Password is required!");
  }
};

const checkPasswordLength = (password) => {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long!");
  }
};

const checkNameNotEmpty = (name) => {
  if (!name || name.trim() === "") {
    throw new Error("Name is required!");
  }
};

const validateEmailInput = (email) => {
  checkEmailNotEmpty(email);
  checkEmailValid(email);
};

const validatePasswordInput = (password) => {
    checkPasswordNotEmpty(password);
    checkPasswordLength(password);
};

const validateNameInput = (name) => {
   checkNameNotEmpty(name);
};

export {
  validateEmailInput,
  validatePasswordInput,
  validateNameInput,
};
