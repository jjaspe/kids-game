import { AgeGroup } from "./types";

export const ageGroups: AgeGroup[] = [
  // Ages 3-4: Simple counting only
  {
    minAge: 3,
    maxAge: 4,
    config: {
      easy: {
        minNumber: 1,
        maxNumber: 5,
        operations: ["+"],
        timeLimit: 20,
        mode: "counting",
      },
      medium: {
        minNumber: 1,
        maxNumber: 8,
        operations: ["+"],
        timeLimit: 15,
        mode: "counting",
      },
      hard: {
        minNumber: 1,
        maxNumber: 10,
        operations: ["+"],
        timeLimit: 10,
        mode: "counting",
      },
    },
  },

  // Ages 5-7: Addition and subtraction
  {
    minAge: 5,
    maxAge: 7,
    config: {
      easy: {
        minNumber: 1,
        maxNumber: 10,
        operations: ["+", "-"],
        timeLimit: 15,
      },
      medium: {
        minNumber: 1,
        maxNumber: 20,
        operations: ["+", "-"],
        timeLimit: 12,
      },
      hard: {
        minNumber: 1,
        maxNumber: 30,
        operations: ["+", "-"],
        timeLimit: 10,
      },
    },
  },

  // Ages 8-10: All basic operations
  {
    minAge: 8,
    maxAge: 10,
    config: {
      easy: {
        minNumber: 1,
        maxNumber: 12,
        operations: ["+", "-", "×"],
        timeLimit: 20,
      },
      medium: {
        minNumber: 1,
        maxNumber: 20,
        operations: ["+", "-", "×", "÷"],
        timeLimit: 15,
      },
      hard: {
        minNumber: 1,
        maxNumber: 30,
        operations: ["+", "-", "×", "÷"],
        timeLimit: 12,
      },
    },
  },

  // Ages 11+: Advanced operations
  {
    minAge: 11,
    maxAge: 18,
    config: {
      easy: {
        minNumber: 2,
        maxNumber: 50,
        operations: ["+", "-", "×", "÷"],
        timeLimit: 20,
      },
      medium: {
        minNumber: 2,
        maxNumber: 100,
        operations: ["+", "-", "×", "÷"],
        timeLimit: 15,
      },
      hard: {
        minNumber: 2,
        maxNumber: 200,
        operations: ["+", "-", "×", "÷"],
        timeLimit: 12,
      },
    },
  },
];
