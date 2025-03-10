const checkNotEmpty = (field, fieldName) => {
  if (field === undefined || field === null || field === "") {
    throw new Error(`${fieldName} is required!`);
  }

  if (typeof field === "string" && field.trim() === "") {
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
  if (planId < 1 || planId > 3) {
    throw new Error("Invalid plan id!");
  }
}

export {
  checkNotEmpty,
  checkPasswordLength,
  checkEmailValid,
  checkPlanIdValid
};
