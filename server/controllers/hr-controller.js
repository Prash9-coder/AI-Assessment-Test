const User = require("../models/user-model");
const Test = require("../models/test-model");
const TestAssignment = require("../models/test-assignment-model");
const crypto = require("crypto");

// ✅ GET /api/hr/monitor - Fetch candidates for monitoring
const getMonitoredTests = async (req, res) => {
  try {
    const candidates = await User.find({ role: "candidate" }).select("-password");
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching monitored candidates:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ POST /api/hr/create-test - Save AI-created test
const createTest = async (req, res) => {
  console.log("🧪 Received test creation request:", req.body);
  console.log("👤 HR ID:", req.user._id);
  console.log("🌐 Request headers:", req.headers);
  console.log("🔍 Request origin:", req.get('origin'));
  
  try {
    const {
      title,
      description,
      category,
      questions,
      duration,
      accessType,
      passingScore,
      enableProctoring,
    } = req.body;

    const createdBy = req.user._id; // from authMiddleware

    const newTest = new Test({
      title,
      description,
      category,
      questions,
      duration,
      accessType,
      passingScore,
      enableProctoring,
      createdBy,
    });

    await newTest.save();
    console.log("✅ Test saved successfully:", newTest._id);

    res.status(201).json({ message: "Test created successfully", test: newTest });
  } catch (error) {
    console.error("❌ Error creating test:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ GET /api/hr/my-tests - Get all tests created by the HR
const getHrCreatedTests = async (req, res) => {
  console.log("📋 Fetching tests for HR:", req.user._id);
  try {
    const tests = await Test.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    console.log("📋 Found tests:", tests.length);
    console.log("📋 First test data:", tests[0] ? {
      title: tests[0].title,
      description: tests[0].description,
      category: tests[0].category,
      questionsCount: tests[0].questions?.length
    } : "No tests found");
    res.status(200).json(tests);
  } catch (error) {
    console.error("❌ Error fetching HR tests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ POST /api/hr/assign-test - Assign test to candidates
const assignTestToCandidates = async (req, res) => {
  console.log("📧 Received test assignment request:", req.body);
  console.log("👤 HR ID:", req.user._id);
  
  try {
    const { testId, candidateEmails } = req.body;
    
    if (!testId || !candidateEmails || !Array.isArray(candidateEmails) || candidateEmails.length === 0) {
      return res.status(400).json({ 
        error: "Test ID and candidate emails are required" 
      });
    }

    // Verify the test exists and belongs to this HR
    const test = await Test.findOne({ _id: testId, createdBy: req.user._id });
    if (!test) {
      return res.status(404).json({ 
        error: "Test not found or you don't have permission to assign it" 
      });
    }

    const assignments = [];
    const errors = [];

    for (const email of candidateEmails) {
      try {
        // Check if assignment already exists
        const existingAssignment = await TestAssignment.findOne({ 
          testId, 
          candidateEmail: email.trim().toLowerCase() 
        });
        
        if (existingAssignment) {
          errors.push(`${email}: Already assigned`);
          continue;
        }

        // Generate unique access token
        const accessToken = crypto.randomBytes(32).toString('hex');
        
        // Check if candidate exists in system
        const candidate = await User.findOne({ 
          email: email.trim().toLowerCase(), 
          role: "candidate" 
        });

        const assignment = new TestAssignment({
          testId,
          candidateEmail: email.trim().toLowerCase(),
          candidateId: candidate ? candidate._id : null,
          assignedBy: req.user._id,
          accessToken
        });

        await assignment.save();
        assignments.push({
          email: email.trim().toLowerCase(),
          accessToken,
          accessLink: `${process.env.CLIENT_URL || 'http://localhost:8081'}/test/${accessToken}`
        });

      } catch (error) {
        console.error(`Error assigning test to ${email}:`, error);
        errors.push(`${email}: ${error.message}`);
      }
    }

    console.log("✅ Test assignments created:", assignments.length);
    
    res.status(201).json({ 
      message: "Test assignment completed",
      assignments,
      errors: errors.length > 0 ? errors : undefined,
      testTitle: test.title
    });

  } catch (error) {
    console.error("❌ Error assigning test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ GET /api/hr/test-assignments/:testId - Get assignments for a specific test
const getTestAssignments = async (req, res) => {
  try {
    const { testId } = req.params;
    
    // Verify the test belongs to this HR
    const test = await Test.findOne({ _id: testId, createdBy: req.user._id });
    if (!test) {
      return res.status(404).json({ 
        error: "Test not found or you don't have permission to view its assignments" 
      });
    }

    const assignments = await TestAssignment.find({ testId })
      .populate('candidateId', 'name email')
      .populate('testId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ assignments, testTitle: test.title });
  } catch (error) {
    console.error("❌ Error fetching test assignments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ POST /api/hr/toggle-publish/:testId - Toggle test publish status
const toggleTestPublish = async (req, res) => {
  console.log("📢 Toggle publish request for test:", req.params.testId);
  console.log("👤 HR ID:", req.user._id);
  
  try {
    const { testId } = req.params;
    
    // Find the test and verify it belongs to this HR
    const test = await Test.findOne({ _id: testId, createdBy: req.user._id });
    if (!test) {
      return res.status(404).json({ 
        error: "Test not found or you don't have permission to modify it" 
      });
    }

    // Toggle the published status
    test.published = !test.published;
    await test.save();

    console.log(`✅ Test ${test.published ? 'published' : 'unpublished'}:`, test.title);
    
    res.status(200).json({ 
      message: `Test ${test.published ? 'published' : 'unpublished'} successfully`,
      test: {
        _id: test._id,
        title: test.title,
        published: test.published
      }
    });

  } catch (error) {
    console.error("❌ Error toggling test publish status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getMonitoredTests,
  createTest,
  getHrCreatedTests,
  assignTestToCandidates,
  getTestAssignments,
  toggleTestPublish,
};
