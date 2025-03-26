// controllers/contactController.js
import ContactUs from "../model/contactUs.js";

// Handle the form submission
export const submitContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Create a new contact form submission
    const contactForm = new ContactUs({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    // Save to the database
    await contactForm.save();

    // Send a success response
    res.status(201).json({
      message: "Your message has been sent successfully. Thank you!",
      success: true,
    });
  } catch (error) {
    console.error("Error saving contact form:", error);
    res.status(500).json({
      message: "There was an error processing your form. Please try again later.",
      success: false,
    });
  }
};

// Fetch all contact form submissions
export const getContactForms = async (req, res) => {
  try {
    // Fetch all submissions from the database
    const contactForms = await ContactUs.find().sort({ createdAt: -1 }); // Sort by most recent

    if (contactForms.length === 0) {
      return res.status(404).json({ message: "No contact forms found." });
    }

    // Send the contact form submissions as the response
    res.status(200).json({
      success: true,
      data: contactForms,
    });
  } catch (error) {
    console.error("Error fetching contact forms:", error);
    res.status(500).json({
      message: "There was an error fetching the contact forms. Please try again later.",
      success: false,
    });
  }
};
