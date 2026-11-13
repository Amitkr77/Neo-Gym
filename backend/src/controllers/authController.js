import Member from '../model/Member.js';
import { signToken, ROLES } from '../middleware/auth.js';
import { verifyPassword, hashPassword } from '../utils/password.js';
import { sendError } from '../utils/httpError.js';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

// Register a new member (public). The role is never taken from the client.
export const signup = async (req, res) => {
  const { username, password, fullName, contactNumber, gender, address } = req.body || {};

  if (![username, password, fullName, contactNumber, gender].every(isNonEmptyString)) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    if (await Member.exists({ username: username.trim() })) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Self-registered members start as Pending until the gym confirms a plan and payment.
    // (Previously they were marked Active immediately without any payment.)
    await Member.create({
      username,
      password, // hashed by the model's pre-save hook
      fullName,
      contactNumber,
      gender,
      address,
      status: 'Pending',
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    sendError(res, error, 'Error creating user');
  }
};

// Member login. Returns a member-scoped JWT.
export const login = async (req, res) => {
  const { username, password } = req.body || {};

  // Reject objects such as {"$ne": null} (NoSQL operator injection).
  if (!isNonEmptyString(username) || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  try {
    const user = await Member.findOne({ username: username.trim() }).select('+password');
    const { ok, legacy } = await verifyPassword(password, user?.password);
    if (!user || !ok) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Members created from the admin panel used to be stored in plaintext; upgrade on login.
    if (legacy) {
      await Member.updateOne({ _id: user._id }, { password: await hashPassword(password) });
    }

    const token = signToken(user._id, ROLES.MEMBER);
    res.status(200).json({ token, role: ROLES.MEMBER, userId: user._id });
  } catch (error) {
    sendError(res, error, 'Error during login');
  }
};
