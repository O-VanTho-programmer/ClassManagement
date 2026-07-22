export const initialNotifications = [
  {
    id: 1,
    sender: "TutorDesk Billing",
    email: "billing@tutordesk.com",
    role: "System",
    subject: "Tuition Invoice Generated - Version 1 (Active Period)",
    snippet: "Dear Student, your tuition invoice for the current active period of Math Class 101 has been generated. Please review...",
    date: "2026-07-10T10:00:00Z",
    category: "tuition",
    isPaid: false,
    amount: "$150.00",
    dueDate: "2026-07-24",
    read: false,
    starred: true,
    deleted: false,
    content: `<p>Dear Student,</p>
              <p>This is to inform you that your tuition invoice for <b>Math Class 101</b> (Billing Cycle / Version 1) has been generated successfully.</p>
              <div class="my-4 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <p class="text-sm text-gray-500">Invoice summary details:</p>
                <ul class="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li><b>Billed Amount:</b> $150.00 USD</li>
                  <li><b>Billing Period:</b> Cycle 1 (Version 1)</li>
                  <li><b>Due Date:</b> July 24, 2026</li>
                  <li><b>Current Status:</b> <span class="text-amber-600 font-semibold">Unpaid</span></li>
                </ul>
              </div>
              <p>Please complete your payment before the due date to ensure uninterrupted access to your class materials, homework portals, and active schedules.</p>
              <p>For support or billing inquiries, please reply to this thread or email us at billing@tutordesk.com.</p>
              <br/>
              <p class="text-gray-400 text-xs">Best regards,<br/>TutorDesk Administration</p>`
  },
  {
    id: 2,
    sender: "Gemini Auto-Grader",
    email: "ai-grader@tutordesk.com",
    role: "AI",
    subject: "Homework Assignment Graded: Physics 101 - Kinematics",
    snippet: "Your submission for Kinematics Part 1 has been graded by the AI. Score: 8.5/10. Feedback details enclosed inside...",
    date: "2026-07-09T14:30:00Z",
    category: "homework",
    read: false,
    starred: false,
    deleted: false,
    content: `<p>Hello Student,</p>
              <p>Your submission for <b>Physics 101 - Kinematics (Assignment 3)</b> has been automatically evaluated by our AI grading engine powered by Google Gemini.</p>
              <div class="my-4 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <p class="text-sm text-gray-500">Grading Summary:</p>
                <div class="flex items-center space-x-3 mb-2">
                  <div class="text-3xl font-bold text-amber-600">8.5</div>
                  <div class="text-sm text-gray-400">/ 10.0 Max Score</div>
                </div>
                <p class="text-sm text-gray-600"><b>AI Evaluation Feedback:</b><br/>"Excellent mathematical execution of projectile path trajectories. You accurately modeled the velocity vectors. A minor sign error was detected in question 4, where the acceleration due to gravity was treated as positive during the descent phase, leading to a deviation in the final time calculation."</p>
              </div>
              <p>If you have any questions regarding these marks, you can schedule a review session with your teacher assistant directly from the class panel.</p>
              <br/>
              <p class="text-gray-400 text-xs">Generated automatically by TutorDesk AI Services</p>`
  },
  {
    id: 3,
    sender: "Mr. John Teacher",
    email: "john.teacher@tutordesk.com",
    role: "Teacher",
    subject: "Schedule Adjustment: Friday Class Session Delayed",
    snippet: "Please note that our upcoming class session on Friday will start 30 minutes later than usual. Adjust your schedules accordingly...",
    date: "2026-07-09T08:15:00Z",
    category: "class",
    read: true,
    starred: false,
    deleted: false,
    content: `<p>Hi everyone,</p>
              <p>Please note that our upcoming class session on <b>Friday (2026-07-12)</b> will start 30 minutes later than usual due to a faculty scheduling conflict.</p>
              <div class="my-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <p class="text-sm text-gray-600"><b>Revised Session Times:</b></p>
                <ul class="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-700 font-mono">
                  <li>Original: 09:00 AM - 11:00 AM</li>
                  <li><span class="text-indigo-600 font-bold">New: 09:30 AM - 11:30 AM</span></li>
                </ul>
              </div>
              <p>Please ensure you adjust your commutes and arrival schedules accordingly. We will still cover the planned review on Thermodynamics.</p>
              <p>Thank you for your understanding, and see you all in class!</p>
              <br/>
              <p class="text-gray-400 text-xs">Best regards,<br/>Mr. John Teacher</p>`
  },
  {
    id: 4,
    sender: "Security Guard Service",
    email: "security@tutordesk.com",
    role: "System",
    subject: "Urgent: Complete your Face Enrollment setup",
    snippet: "To enable face authentication for class attendance and homework submissions, you must complete your face enrollment in the dashboard...",
    date: "2026-07-08T11:00:00Z",
    category: "system",
    read: true,
    starred: true,
    deleted: false,
    content: `<p>Dear Student,</p>
              <p>To enable secure biometric check-ins and verify your identity during homework submissions, you are required to submit a face reference profile.</p>
              <p>Currently, your profile shows <b>biometrics pending</b>. This enrollment step is mandatory before you can submit assignments that have face authentication enabled.</p>
              <div class="my-4 p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
                <h4 class="text-sm font-semibold text-red-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> Action Required
                </h4>
                <p class="text-xs text-red-600">Please navigate to your Account Settings -> Biometric Settings, enable your web camera, and align your face in the center of the viewport to capture a reference biometric hash.</p>
              </div>
              <p>All biometric descriptors are stored securely as JSON hashes locally on the server database and are encrypted at rest.</p>
              <br/>
              <p class="text-gray-400 text-xs">TutorDesk Security & Audit Team</p>`
  },
  {
    id: 5,
    sender: "TutorDesk Billing",
    email: "billing@tutordesk.com",
    role: "System",
    subject: "Overdue Notice: Tuition Payment Cycle #3 (Math 101)",
    snippet: "Your tuition invoice for Math 101 (Billing Cycle Version 3) is now overdue by 5 days. Please resolve immediately...",
    date: "2026-07-05T09:00:00Z",
    category: "tuition",
    read: true,
    starred: false,
    deleted: false,
    content: `<p>Dear Student,</p>
              <p>Our records indicate that your tuition payment for <b>Math 101</b> (Billing Cycle / Version 3) has not been received and is now <b>5 days overdue</b>.</p>
              <div class="my-4 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <p class="text-sm text-amber-700 font-semibold">Overdue Account Details:</p>
                <ul class="list-disc pl-5 text-xs text-amber-800">
                  <li>Invoice ID: #INV-00293</li>
                  <li>Overdue Amount: $150.00 USD</li>
                  <li>Original Due Date: July 5, 2026</li>
                </ul>
              </div>
              <p>Please resolve this bill immediately to prevent potential late fees or class dashboard locks. If you have already paid, please upload your proof of payment via the Invoice dashboard.</p>
              <br/>
              <p class="text-gray-400 text-xs">Thank you,<br/>TutorDesk Billing Team</p>`
  }
];
