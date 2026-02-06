/* auth.js - تسجيل دخول بسيط (localStorage) */
(function () {
  'use strict';

  const AUTH_KEYS = {
    users: 'installments_auth_users',
    session: 'installments_auth_session'
  };

  function safeJsonParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch (_) {
      return fallback;
    }
  }

  function normalizeUsername(u) {
    return (u || '').toString().trim().toLowerCase();
  }

  function getUsers() {
    const raw = localStorage.getItem(AUTH_KEYS.users);
    const users = safeJsonParse(raw, []);
    if (!Array.isArray(users)) return [];
    return users
      .filter(u => u && typeof u.username === 'string' && typeof u.password === 'string')
      .map(u => ({ username: u.username, password: u.password }));
  }

  function setUsers(users) {
    localStorage.setItem(AUTH_KEYS.users, JSON.stringify(users));
  }

  function ensureDefaultUser() {
    // للإبقاء على التوافق مع app.js / login.js فقط
    // (لم نعد ننشئ بيانات افتراضية داخل الكود)
    return false;
  }

  function hasUsers() {
    return getUsers().length > 0;
  }

  function createFirstUser({ username, password, confirmPassword } = {}) {
    const uRaw = (username || '').toString();
    const u = uRaw.trim();
    const p = (password || '').toString();
    const c = (confirmPassword || '').toString();

    if (hasUsers()) {
      return { ok: false, error: 'تم إعداد تسجيل الدخول مسبقاً.' };
    }
    if (!u || !p) {
      return { ok: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور.' };
    }
    if (p.length < 4) {
      return { ok: false, error: 'كلمة المرور قصيرة جداً (على الأقل 4 أحرف).' };
    }
    if (p !== c) {
      return { ok: false, error: 'تأكيد كلمة المرور غير مطابق.' };
    }
    // نمنع أحرف خطرة بسيطة
    if (u.length > 32) {
      return { ok: false, error: 'اسم المستخدم طويل جداً.' };
    }

    setUsers([{ username: u, password: p }]);
    return { ok: true, username: u };
  }

  function getSession() {
    const raw = localStorage.getItem(AUTH_KEYS.session);
    const session = safeJsonParse(raw, null);
    if (!session || typeof session !== 'object') return null;
    if (!session.username || !session.expiresAt) return null;

    const expiresAt = Number(session.expiresAt);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      localStorage.removeItem(AUTH_KEYS.session);
      return null;
    }
    return session;
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function login({ username, password, remember } = {}) {
    const u = normalizeUsername(username);
    const p = (password || '').toString();
    if (!u || !p) {
      return { ok: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور.' };
    }

    const users = getUsers();
    const found = users.find(x => normalizeUsername(x.username) === u);
    if (!found || found.password !== p) {
      return { ok: false, error: 'بيانات الدخول غير صحيحة.' };
    }

    const ttlMs = remember ? (30 * 24 * 60 * 60 * 1000) : (12 * 60 * 60 * 1000);
    const session = {
      username: found.username,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlMs
    };
    localStorage.setItem(AUTH_KEYS.session, JSON.stringify(session));
    return { ok: true, username: found.username };
  }

  function logout() {
    localStorage.removeItem(AUTH_KEYS.session);
  }

  function changePassword({ username, oldPassword, newPassword } = {}) {
    const u = normalizeUsername(username);
    const oldP = (oldPassword || '').toString();
    const newP = (newPassword || '').toString();

    if (!u || !oldP || !newP) {
      return { ok: false, error: 'يرجى تعبئة جميع الحقول.' };
    }
    if (newP.length < 4) {
      return { ok: false, error: 'كلمة المرور الجديدة قصيرة جداً (على الأقل 4 أحرف).' };
    }

    const users = getUsers();
    const idx = users.findIndex(x => normalizeUsername(x.username) === u);
    if (idx === -1) return { ok: false, error: 'المستخدم غير موجود.' };
    if (users[idx].password !== oldP) return { ok: false, error: 'كلمة المرور الحالية غير صحيحة.' };

    users[idx] = { ...users[idx], password: newP };
    setUsers(users);
    return { ok: true };
  }

  function getNextFromQuery() {
    try {
      const params = new URLSearchParams(window.location.search || '');
      const next = params.get('next') || '';
      // حماية بسيطة: نسمح فقط بروابط نسبية داخل نفس المشروع
      if (!next) return 'index.html';
      const lowered = next.toLowerCase();
      if (lowered.includes('://') || lowered.startsWith('javascript:')) return 'index.html';
      return next;
    } catch (_) {
      return 'index.html';
    }
  }

  function redirectToLogin(next = 'index.html') {
    const url = `login.html?next=${encodeURIComponent(next)}`;
    window.location.replace(url);
  }

  window.auth = {
    AUTH_KEYS,
    getUsers,
    ensureDefaultUser,
    hasUsers,
    createFirstUser,
    getSession,
    isLoggedIn,
    login,
    logout,
    changePassword,
    getNextFromQuery,
    redirectToLogin
  };
})();

