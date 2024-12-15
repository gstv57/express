export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with a max of 32 characters",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isString: {
      errorMessage: "Email must be a string!",
    },
  },
  role: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Role must be at least 5 characters with a max of 32 characters",
    },
    isString: {
      errorMessage: "Role must be a string!",
    },
  },
};
