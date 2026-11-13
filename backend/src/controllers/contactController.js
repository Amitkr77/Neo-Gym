import ContactUs from "../model/contactUs.js";
import { sendError } from "../utils/httpError.js";

const str = (v) => (typeof v === "string" ? v : undefined);

// Public: website contact / enquiry form.
export const submitContactForm = async (req, res) => {
  const body = req.body || {};
  const data = {
    firstName: str(body.firstName),
    lastName: str(body.lastName),
    email: str(body.email),
    phone: str(body.phone),
    message: str(body.message),
  };

  if (!data.firstName || !data.lastName || !data.email || !data.message) {
    return res.status(400).json({ message: "All required fields must be filled.", success: false });
  }

  try {
    await ContactUs.create(data);
    res.status(201).json({ message: "Your message has been sent successfully. Thank you!", success: true });
  } catch (error) {
    sendError(res, error, "There was an error processing your form. Please try again later.");
  }
};

// Admin: list enquiries (most recent first). An empty list is a normal state, not a 404.
export const getContactForms = async (_req, res) => {
  try {
    const contactForms = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contactForms });
  } catch (error) {
    sendError(res, error, "There was an error fetching the contact forms. Please try again later.");
  }
};
