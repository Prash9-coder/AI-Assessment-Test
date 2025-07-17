const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const {
  createTest,
  getAllTests,
  getTestById,
  submitAttempt,
  getCandidateAttempts,
  getMyAttempts,
  getAttemptDetail,
  getAllAttempts,
  getAvailableTests,
  getAllPublishedTests,
  getTestByToken,
  clearCache,
} = require("../controllers/test-controller");

router.post("/create", authMiddleware, createTest);
router.get("/", authMiddleware, getAllTests); // ← protected route
router.get("/available", authMiddleware, getAvailableTests); // ← new route for candidates
router.get("/published", authMiddleware, getAllPublishedTests); // ← new route for dashboard
router.get("/my-attempts", authMiddleware, getMyAttempts); // ← new route for current user attempts
router.get("/attempt/:attemptId", authMiddleware, getAttemptDetail); // ← new route for detailed results
router.get("/:id", authMiddleware, getTestById);
router.post("/:testId/submit", authMiddleware, submitAttempt);
router.get("/candidate/:candidateId", authMiddleware, getCandidateAttempts);
router.get("/attempts/all", authMiddleware, getAllAttempts);

// ✅ Route to access test by token (public access for invited candidates)
router.get("/by-token/:token", getTestByToken);

// 🧹 Debug route to clear cache
router.post("/clear-cache", authMiddleware, clearCache);

module.exports = router;