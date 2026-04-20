import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_ro2wxjv";
const TEMPLATE_ID = "template_l82gcp3"; // your complaint template ID
const PUBLIC_KEY = "1j0FmQASFxPseN1WS";

// ── Complaint confirmation email ──
export const sendEmail = async ({ name, email, complaintTitle }) => {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name: name,
        to_email: email,
        message: `Your complaint "${complaintTitle}" has been successfully submitted to the Municipal Corporation. Our team will review it and take action shortly.`,
      },
      PUBLIC_KEY
    );
    console.log("✅ Complaint email sent!");
    return { success: true };
  } catch (error) {
    console.error("❌ Complaint email failed:", error);
    return { success: false };
  }
};

// ── Login notification email ──
export const sendLoginEmail = async ({ name, email, role }) => {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name: name,
        to_email: email,
        message: `You have successfully logged into the Municipal Corporation Complaint System as ${role}. If this was not you, please contact us immediately.`,
      },
      PUBLIC_KEY
    );
    console.log("✅ Login email sent!");
  } catch (error) {
    // Login should NOT fail if email fails
    console.error("❌ Login email failed:", error);
  }
};