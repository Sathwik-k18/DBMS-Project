import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_ro2wxjv";    
const TEMPLATE_ID = "template_wr980no"; 
const PUBLIC_KEY = "1j0FmQASFxPseN1WS"; 

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async ({ name, email, otp }) => {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name: name,
        to_email: email,
        otp_code: otp,
      },
      PUBLIC_KEY
    );
    console.log("✅ OTP email sent!");
    return { success: true };
  } catch (error) {
    console.error("❌ OTP email failed:", error);
    return { success: false };
  }
};