// Mock Auth Service ready to swap with real API endpoints
export const authService = {
  async login(email, password) {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 600));

    if (email === 'fail@snapfit.com') {
      throw new Error('Invalid credentials. Please check your email and password.');
    }

    // Check if user was registered previously
    const registeredUsers = JSON.parse(localStorage.getItem('snapfit_registered_accounts') || '[]');
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    const userObj = existing || {
      id: 'usr_7890',
      name: email === 'rahul.sharma@snapfit.ai'
        ? 'Rahul Sharma'
        : (email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'SnapFit User'),
      email: email || 'rahul.sharma@snapfit.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      goal: 'Build Muscle'
    };

    localStorage.setItem('snapfit_token', 'mock_jwt_token_xyz123');
    localStorage.setItem('snapfit_user', JSON.stringify(userObj));
    localStorage.setItem('user', JSON.stringify(userObj));
    localStorage.setItem('isLoggedIn', 'true');

    return { user: userObj, token: 'mock_jwt_token_xyz123' };
  },

  async register(name, email, password, goal, extraProfile = {}) {
    await new Promise((res) => setTimeout(res, 600));

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || 'SnapFit User',
      email: email,
      goal: goal || 'Build Muscle',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      ...extraProfile
    };

    // Store in registered users list
    const registeredUsers = JSON.parse(localStorage.getItem('snapfit_registered_accounts') || '[]');
    const filtered = registeredUsers.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    filtered.push(newUser);
    localStorage.setItem('snapfit_registered_accounts', JSON.stringify(filtered));

    // Save newly registered email for pre-filling login
    localStorage.setItem('snapfit_last_registered_email', email);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('snapfit_user', JSON.stringify(newUser));

    return { user: newUser };
  },

  async logout() {
    localStorage.removeItem('snapfit_token');
    localStorage.setItem('isLoggedIn', 'false');
  },

  getCurrentUser() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return null;
    const saved = localStorage.getItem('user') || localStorage.getItem('snapfit_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
