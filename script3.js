// جلب أسماء المهندسين من الخادم
fetch('http://localhost:5000/engineers')
  .then(response => response.json())
  .then(data => {
    console.log('Received data:', data); // عرض البيانات في وحدة التحكم

    if (data.success) {
      const engineers = data.engineers;
      const engineerList = document.getElementById('engineer-list');
      const loggedInUser = localStorage.getItem('loggedInUser');

      console.log('Logged in user:', loggedInUser);

      let loggedInEngineer = '';

      // إضافة أسماء المهندسين إلى الصفحة
      engineers.forEach(engineer => {
        console.log('Engineer data:', engineer);

        if (engineer.eng_name && engineer.username) {
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          
          // إضافة اسم المهندس في النص
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(' ' + engineer.eng_name));

          // إذا كان اسم المستخدم يطابق المهندس في نفس الصف (عمود username)
          if (loggedInUser === engineer.username) {
            checkbox.checked = true;
            checkbox.disabled = true;
            loggedInEngineer = engineer.eng_name;

            const firstName = loggedInEngineer.split(' ')[0];
            document.getElementById('logged-in-engineer').textContent = firstName;
          }

          engineerList.appendChild(label);
        } else {
          console.error('Invalid engineer data:', engineer);
        }
      });
    } else {
      console.error('Error fetching engineers:', data.message);
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

// جلب قائمة المدن من الخادم المحلي
fetch('http://localhost:5000/cities')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const cities = data.cities;
      const citySelect = document.getElementById('city');

      // إضافة المدن إلى القائمة المنسدلة
      cities.forEach(city => {
        const option = document.createElement('option');
        option.textContent = city;
        option.value = city;
        citySelect.appendChild(option);
      });

      // عند تغيير المدينة، جلب الجهات المرتبطة بها
      citySelect.addEventListener('change', function() {
        const selectedCity = citySelect.value;
        
        // تفريغ وتفعيل حقل الجهة عند اختيار مدينة جديدة
        const entitySelect = document.getElementById('entity');
        entitySelect.innerHTML = '<option>اختر اسم الجهة</option>';
        entitySelect.disabled = selectedCity === ''; // تعطيل القائمة إذا لم يتم اختيار مدينة

        if (selectedCity) {
          fetchEntitiesByCity(selectedCity);
        }
      });
    } else {
      console.error('خطأ أثناء جلب المدن:', data.message);
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

// دالة لجلب قائمة الجهات بناءً على المدينة المحددة
function fetchEntitiesByCity(city) {
  fetch(`http://localhost:5000/entitiesByCity?city=${encodeURIComponent(city)}`)
    .then(response => response.json())
    .then(data => {
      console.log('Received entities data:', data);

      if (data.success) {
        const entities = data.entities;
        const entitySelect = document.getElementById('entity');

        // تفريغ قائمة الجهات قبل إضافات جديدة
        entitySelect.innerHTML = '<option>اختر اسم الجهة</option>';

        // إضافة الجهات إلى القائمة المنسدلة
        entities.forEach(entity => {
          const option = document.createElement('option');
          option.textContent = entity;
          entitySelect.appendChild(option);
        });

        entitySelect.disabled = false; // تفعيل حقل "الجهة"
      } else {
        console.error('خطأ أثناء جلب الجهات:', data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

// الانتقال إلى صفحة جديدة عند النقر على "التالي"
document.querySelector('.next-button').addEventListener('click', function() {
  window.location.href = 'next_page.html';
});
