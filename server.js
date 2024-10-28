const express = require('express');
const cors = require('cors');
const axios = require('axios'); // لإرسال الطلب إلى Apps Script
const app = express();

app.use(cors());
app.use(express.json());

// نقطة نهاية '/login' للتحقق من بيانات المستخدم
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المستخدم وكلمة المرور' });
  }

  try {
    const response = await axios.post('https://script.google.com/macros/s/AKfycbw03yk5ERi2mnWTzhA84HD6Gx6ZfZ0DIuSv4rsIN7qrls-ilFX6KNkX7b2FaJbf00oDfw/exec', {
      username: username,
      password: password,
    });

    const data = response.data;

    if (data.success) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in login:', error.message);
    res.status(500).json({ success: false, message: 'Error verifying credentials' });
  }
});

// نقطة نهاية '/engineers' لجلب أسماء المهندسين من Google Sheets
app.get('/engineers', async (req, res) => {
  try {
    const response = await axios.get('https://script.google.com/macros/s/AKfycbz78kXIkl92lIYpEPUixWd6h4mxJmXRyJtSOUM5rBUQQ4QDHgeaJKoxKGAEIiFGWU4bIQ/exec');
    
    console.log('Data from Google Sheets:', response.data);

    if (response.data && response.data.engineers) {
      res.json({ success: true, engineers: response.data.engineers });
    } else {
      res.status(500).json({ success: false, message: 'No engineers found' });
    }
  } catch (error) {
    console.error('Error fetching engineers:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching engineers' });
  }
});

// نقطة نهاية '/cities' لجلب المدن من Google Sheets
app.get('/cities', async (req, res) => {
  try {
    const response = await axios.get('https://script.google.com/macros/s/AKfycbx1OxatbKoByzQg_Auy3vOC9uDtmwRGV3vqOMVJCkDkQ0-Ocav_XO_MplHNqxcRHR8OZg/exec');
    
    const cities = response.data.cities;

    if (cities && cities.length > 0) {
      res.json({ success: true, cities: cities });
    } else {
      res.status(500).json({ success: false, message: 'No cities found' });
    }
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching cities' });
  }
});

// نقطة نهاية '/entities' لجلب الجهات من Google Sheets
app.get('/entities', async (req, res) => {
  try {
    const response = await axios.get('https://script.google.com/macros/s/AKfycbyHF6fQFw3qCkvpR3DYOq-Ugc_swdKxrhchOwl1wwq7XPFefDC-JXEkEG3q7PeQJjww/exec');
    const entities = response.data;

    console.log('Received entities data from Apps Script:', entities);

    if (entities && entities.entities && entities.entities.length > 0) {
      res.json({ success: true, entities: entities.entities });
    } else {
      res.status(500).json({ success: false, message: 'No entities found' });
    }
  } catch (error) {
    console.error('Error fetching entities:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching entities' });
  }
});

// نقطة نهاية جديدة '/entitiesByCity' لجلب الجهات حسب المدينة
app.get('/entitiesByCity', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ success: false, message: 'يرجى تقديم اسم المدينة' });
  }

  try {
    const response = await axios.get(`https://script.google.com/macros/s/AKfycbyH2S8lbRJEkJzyPLCgBp6SMYMhuW9lzmpi7hoFU-5tYhmNgpa1jZ9jptzGtOGUJb7DVA/exec?city=${encodeURIComponent(city)}`);
    const entities = response.data;

    if (entities && entities.entities && entities.entities.length > 0) {
      res.json({ success: true, entities: entities.entities });
    } else {
      res.status(500).json({ success: false, message: 'No entities found for the specified city' });
    }
  } catch (error) {
    console.error('Error fetching entities by city:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching entities by city' });
  }
});

// بدء الخادم
app.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
