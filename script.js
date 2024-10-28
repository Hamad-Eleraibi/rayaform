// الانتقال إلى صفحة استعادة كلمة المرور
function goToResetPage() {
  window.location.href = 'forgot_password.html'; // اسم الصفحة الخاصة باستعادة كلمة المرور
}

// العودة إلى صفحة تسجيل الدخول
function goToLoginPage() {
  window.location.href = 'index.html'; // اسم الصفحة الخاصة بتسجيل الدخول
}

// إضافة تأثير placeholder المصغر عند الكتابة
function addInputEffect(inputElement, labelElement) {
  inputElement.addEventListener('focus', () => {
      labelElement.classList.add('active');
  });

  inputElement.addEventListener('blur', () => {
      if (inputElement.value === '') {
          labelElement.classList.remove('active');
      }
  });

  // إذا كان هناك قيمة بالفعل، ابدأ بتفعيل التأثير
  if (inputElement.value !== '') {
      labelElement.classList.add('active');
  }
}

// التحكم في عرض/إخفاء كلمة المرور
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const toggleButton = document.getElementById('togglePassword');

  toggleButton.addEventListener('click', function () {
      // تغيير نوع الإدخال بين "password" و "text"
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);

      // تغيير النص على الزر بين "عرض" و "إخفاء"
      toggleButton.textContent = type === 'password' ? 'عرض' : 'إخفاء';

      // تعديل الألوان والخلفية للزر
      if (type === 'text') {
          toggleButton.style.backgroundColor = '#e0f4e9';
          toggleButton.style.border = '2px solid #007b1b';
          toggleButton.style.color = '#007b1b';
      } else {
          toggleButton.style.backgroundColor = 'transparent';
          toggleButton.style.border = '2px solid #007b1b';
          toggleButton.style.color = '#007b1b';
      }
  });

  // إخفاء الإطار عند النقر خارج الحقل
  document.addEventListener('click', function (event) {
    if (!passwordInput.contains(event.target) && !toggleButton.contains(event.target)) {
      toggleButton.style.border = 'none'; // إخفاء الإطار
    }
  });
}

// تنفيذ طلب تسجيل الدخول
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // تحقق من أن الحقول ليست فارغة
  if (!username || !password) {
    alert('يرجى إدخال اسم المستخدم وكلمة المرور.');
    document.getElementById('username').classList.add('error');
    document.getElementById('password').classList.add('error');
    return;
  }

  // إرسال طلب تسجيل الدخول إلى الخادم
  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('loggedInUser', username);
      window.location.href = 'third_page.html'; // الانتقال إلى الصفحة الثالثة
    } else {
      alert(data.message); // عرض رسالة الخطأ
      document.getElementById('username').classList.add('error');
      document.getElementById('password').classList.add('error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// إزالة اللون الأحمر عند التعديل على الإدخال
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error'); // إزالة صنف "error" عند البدء في الكتابة مرة أخرى
  });
});

// تفعيل التأثيرات بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const usernameLabel = document.querySelector('label[for="username"]');
  const passwordInput = document.getElementById('password');
  const passwordLabel = document.querySelector('label[for="password"]');
  const togglePassword = document.getElementById('togglePassword');

  // إضافة تأثيرات الإدخال على حقول اسم المستخدم وكلمة المرور
  addInputEffect(usernameInput, usernameLabel);
  addInputEffect(passwordInput, passwordLabel);

  // تفعيل زر عرض/إخفاء كلمة المرور
  togglePasswordVisibility();
});
