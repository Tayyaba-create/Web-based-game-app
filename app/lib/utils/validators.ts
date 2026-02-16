// Validation utility functions

export const validators = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate name (2-50 characters)
  isValidName: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  },

  // Validate session code (any format allowed, 1+ characters)
  isValidSessionCode: (code: string): boolean => {
    return code.trim().length > 0;
  },

  // Validate language code
  isValidLanguage: (code: string): boolean => {
    const validCodes = ["en", "pt", "fr"];
    return validCodes.includes(code);
  },

  // Validate chest code (3 digits)
  isValidChestCode: (code: string): boolean => {
    return /^\d{3}$/.test(code);
  },
};
