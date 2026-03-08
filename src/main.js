// Validace formulářů na straně klienta

document.addEventListener('DOMContentLoaded', () => {

  // --- Login form ---
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const errorEl = document.getElementById('clientError');

      if (!username || !password) {
        e.preventDefault();
        errorEl.textContent = 'Vyplň všechna pole!';
      }
    });
  }

  // --- Register form ---
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const password2 = document.getElementById('password2').value;
      const errorEl = document.getElementById('clientError');

      if (!username || !password || !password2) {
        e.preventDefault();
        errorEl.textContent = 'Vyplň všechna pole!';
        return;
      }
      if (username.length < 2) {
        e.preventDefault();
        errorEl.textContent = 'Jméno musí mít alespoň 2 znaky!';
        return;
      }
      if (password.length < 4) {
        e.preventDefault();
        errorEl.textContent = 'Heslo musí mít alespoň 4 znaky!';
        return;
      }
      if (password !== password2) {
        e.preventDefault();
        errorEl.textContent = 'Hesla se neshodují!';
      }
    });
  }

  // --- Aktivní nav odkaz ---
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });

});
