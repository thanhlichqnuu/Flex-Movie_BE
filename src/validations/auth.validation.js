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
  if (typeof planId !== "number" || planId < 1 || planId > 3) {
    throw new Error("Invalid plan id!");
  }
}

const checkOTPValid = (otpCode) => {
  if (typeof otpCode !== "number" || otpCode < 100000 || otpCode > 999999) {
    throw new Error("OTP must be a 6-digit number!");
  }
};

export {
  checkNotEmpty,
  checkPasswordLength,
  checkEmailValid,
  checkPlanIdValid,
  checkOTPValid
};
