/* login.js - منطق تسجيل الدخول */
(function () {
  'use strict';

  function $(id) {
    return document.getElementById(id);
  }

  function setMessage(text) {
    const box = $('loginMessage');
    if (!box) return;
    if (!text) {
      box.style.display = 'none';
      box.textContent = '';
      return;
    }
    box.style.display = 'block';
    box.textContent = text;
  }

  function redirectAfterLogin() {
    const next = window.auth?.getNextFromQuery?.() || 'index.html';
    window.location.replace(next);
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('year').textContent = new Date().getFullYear();

    if (!window.auth) {
      setMessage('تعذر تحميل نظام الدخول (auth.js).');
      return;
    }

    // ملاحظة: لم نعد ننشئ بيانات افتراضية نهائياً
    window.auth.ensureDefaultUser();

    // إذا مسجل دخول مسبقاً، نروح مباشرة
    if (window.auth.isLoggedIn()) {
      redirectAfterLogin();
      return;
    }

    const loginForm = $('loginForm');
    const setupForm = $('setupForm');

    const hasUsers = typeof window.auth.hasUsers === 'function'
      ? window.auth.hasUsers()
      : (window.auth.getUsers().length > 0);

    // إذا ماكو مستخدمين: نعرض إعداد أول مرة
    if (!hasUsers) {
      if (loginForm) loginForm.style.display = 'none';
      if (setupForm) setupForm.style.display = 'block';
      $('suUsername')?.focus();
    } else {
      if (loginForm) loginForm.style.display = 'block';
      if (setupForm) setupForm.style.display = 'none';
      $('loginUsername')?.focus();
    }

    loginForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      setMessage('');

      const username = $('loginUsername')?.value || '';
      const password = $('loginPassword')?.value || '';
      const remember = !!$('rememberMe')?.checked;

      const result = window.auth.login({ username, password, remember });
      if (!result.ok) {
        setMessage(result.error || 'حدث خطأ.');
        return;
      }

      redirectAfterLogin();
    });

    setupForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      setMessage('');

      const username = $('suUsername')?.value || '';
      const password = $('suPassword')?.value || '';
      const confirmPassword = $('suConfirm')?.value || '';

      const result = window.auth.createFirstUser({ username, password, confirmPassword });
      if (!result.ok) {
        setMessage(result.error || 'تعذر إنشاء المستخدم.');
        return;
      }

      // بعد الإنشاء، نسجل دخول مباشرة ونحوّل
      const loginResult = window.auth.login({ username, password, remember: true });
      if (!loginResult.ok) {
        setMessage('تم إنشاء المستخدم، لكن تعذر تسجيل الدخول. حاول تسجيل الدخول يدوياً.');
        if (loginForm) loginForm.style.display = 'block';
        if (setupForm) setupForm.style.display = 'none';
        return;
      }
      redirectAfterLogin();
    });

    const changeForm = $('changePasswordForm');
    changeForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      setMessage('');

      const username = $('cpUsername')?.value || '';
      const oldPassword = $('cpOld')?.value || '';
      const newPassword = $('cpNew')?.value || '';

      const result = window.auth.changePassword({ username, oldPassword, newPassword });
      if (!result.ok) {
        setMessage(result.error || 'تعذر تغيير كلمة المرور.');
        return;
      }

      setMessage('تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.');
      $('loginUsername').value = username;
      $('loginPassword').value = '';
      $('loginPassword')?.focus();
    });
  });
})();

