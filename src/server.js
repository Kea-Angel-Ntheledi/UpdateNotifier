require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.json();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'UpdateNotifier is running!',
    timestamp: new Date().toISOString()
  });
});

// Webhook endpoint for GitHub commits
app.post('/webhook/github', (req, res) => {
  console.log('📩 Received GitHub webhook!');
  
  const payload = req.body;
  
  // Check if this is a push event with commits
  if (payload.commits && payload.commits.length > 0) {
    payload.commits.forEach(commit => {
      const commitInfo = {
        author: commit.author.name,
        message: commit.message,
        timestamp: commit.timestamp,
        url: commit.url
      };
      
      console.log('✅ New Commit:', commitInfo);
      
      // TODO: Send notification here
      // This is where we'll integrate email/SMS/push notifications
    });
    
    res.status(200).json({ message: 'Commits processed successfully' });
  } else {
    res.status(200).json({ message: 'No commits in this push' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 UpdateNotifier running on port ${PORT}`);
  console.log(`📍 Webhook URL: http://localhost:${PORT}/webhook/github`);
});