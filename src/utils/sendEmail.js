import emailjs from "@emailjs/browser";

// 🔁 Replace these 3 values with yours from EmailJS dashboard
const SERVICE_ID = "service_ro2wxjv";
const TEMPLATE_ID = "template_l82gcp3";
const PUBLIC_KEY = "1j0FmQASFxPseN1WS";

export const sendEmail = async ({ name, email, complaintTitle }) => {
  const templateParams = {
    to_name: name,
    to_email: email,
    complaint_title: complaintTitle,
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log("✅ Confirmation email sent!", result.text);
    return { success: true };
  } catch (error) {
    console.error("❌ Email failed:", error);
    return { success: false };
  }
};