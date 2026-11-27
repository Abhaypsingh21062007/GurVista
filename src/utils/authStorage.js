/* ============================================================
   Gurvista — Demonstration Authentication Storage
   All accounts are localStorage-only, demo-purpose accounts.
   No real passwords are stored or validated.
   ============================================================ */

const USERS_KEY    = 'gurvista_users';
const SESSION_KEY  = 'gurvista_session';

/** Pre-seeded demo accounts so users can log in immediately */
const DEMO_USERS = [
  {
    id:           'demo-buyer-1',
    role:         'buyer',
    name:         'Rahul Sharma',
    email:        'rahul@demo.com',
    phone:        '9876543210',
    city:         'Muzaffarnagar',
    state:        'Uttar Pradesh',
    createdAt:    '2026-01-15T08:00:00.000Z',
  },
  {
    id:           'demo-seller-1',
    role:         'seller',
    name:         'Suresh Kumar',
    businessName: 'Kumar Gur Udyog',
    email:        'suresh@demo.com',
    phone:        '9988776655',
    city:         'Muzaffarnagar',
    state:        'Uttar Pradesh',
    gst:          '09AABCU9603R1ZX',
    address:      'Village Shahpur, Muzaffarnagar',
    createdAt:    '2026-01-10T08:00:00.000Z',
  },
];

function getUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    return JSON.parse(stored);
  } catch {
    return [...DEMO_USERS];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Register a new demonstration account */
export function registerUser(userData) {
  const users = getUsers();
  const existing = users.find(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase()
  );
  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }
  const newUser = {
    id:        `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...userData,
  };
  saveUsers([...users, newUser]);
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return { success: true, user: newUser };
}

/** Sign in to a demonstration account (email + role, no password) */
export function loginUser(email, role) {
  const users = getUsers();
  const user  = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.role === role
  );
  if (!user) {
    return {
      success: false,
      error:
        'No account found with this email and role. Please register first, or use a demo account below.',
    };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

/** Return the currently signed-in user, or null */
export function getCurrentUser() {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

/** Sign out */
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

/** Update the profile of the currently signed-in user */
export function updateUserProfile(updatedFields) {
  const current = getCurrentUser();
  if (!current) return { success: false, error: 'Not signed in.' };
  const users = getUsers();
  const idx   = users.findIndex((u) => u.id === current.id);
  if (idx === -1) return { success: false, error: 'User record not found.' };
  const updated = { ...users[idx], ...updatedFields };
  users[idx]    = updated;
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  return { success: true, user: updated };
}

export const DEMO_CREDENTIALS = [
  { role: 'buyer',  email: 'rahul@demo.com',  label: 'Demo Buyer'  },
  { role: 'seller', email: 'suresh@demo.com', label: 'Demo Seller' },
];
