// const express = require('express');
// const app = express();
// const cors = require('cors');
// const userRoutes = require('./routes/routes');
// const db = require('./config/database');



// app.use(cors());
// app.use(express.json());
// app.use('/api', userRoutes);

// app.listen(4000, () => {
//   console.log('✅ Server running on http://localhost:4000');
// });


const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/routes');
const db = require('./config/database');
 const authData = require('./routes/Auth')
  const api2 = require('./routes/routes2');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ✅ Ye line image ko browser se access karne ke liye hai
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api', userRoutes);

 app.use('/auth', authData);
  app.use('/api2', api2);

app.listen(4000, () => {
  console.log('✅ Server running on http://localhost:4000');
});
