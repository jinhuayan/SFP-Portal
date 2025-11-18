import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('⚠️  SENDGRID_API_KEY not set. Email functionality will be disabled.');
}

/**
 * Send adoption application confirmation email to applicant
 */
export const sendApplicationConfirmationEmail = async (applicationData) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('📧 Email not sent (SendGrid not configured):', applicationData.email);
    return { success: false, message: 'SendGrid not configured' };
  }

  const { 
    email, 
    full_name, 
    animal_id,
    animal_name,
    application_id 
  } = applicationData;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@sfp-portal.com', // Your verified sender email
    subject: `Application Received - ${animal_name} (${animal_id})`,
    text: `
Dear ${full_name},

Thank you for your interest in adopting ${animal_name} (ID: ${animal_id})!

We have received your adoption application (Application ID: ${application_id}) and our team will review it shortly.

What happens next:
1. Our team will review your application (typically within 3-5 business days)
2. If approved, we'll schedule an interview with you
3. After a successful interview, we'll arrange a meet-and-greet with ${animal_name}
4. If everything goes well, we'll finalize the adoption!

You can track the status of your application by logging into your account on our website.

If you have any questions, please don't hesitate to contact us.

Thank you for choosing to adopt and giving ${animal_name} a loving home!

Best regards,
The SFP Portal Team

---
This is an automated email. Please do not reply to this email.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; background-color: #4C51A4; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Application Received! 🎉
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear <strong>${full_name}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in adopting <strong>${animal_name}</strong> (ID: ${animal_id})!
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #4C51A4; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #4C51A4; font-weight: bold;">
                  Application ID: ${application_id}
                </p>
                <p style="margin: 0; color: #666666; font-size: 14px;">
                  Please save this ID for your records
                </p>
              </div>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                We have received your adoption application and our team will review it shortly.
              </p>
              
              <h2 style="margin: 30px 0 20px 0; color: #4C51A4; font-size: 20px;">
                What happens next?
              </h2>
              
              <ol style="margin: 0 0 20px 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                <li style="margin-bottom: 10px;">
                  Our team will review your application (typically within 3-5 business days)
                </li>
                <li style="margin-bottom: 10px;">
                  If approved, we'll schedule an interview with you
                </li>
                <li style="margin-bottom: 10px;">
                  After a successful interview, we'll arrange a meet-and-greet with ${animal_name}
                </li>
                <li style="margin-bottom: 10px;">
                  If everything goes well, we'll finalize the adoption!
                </li>
              </ol>
              
              <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                You can track the status of your application by logging into your account on our website.
              </p>
              
              <p style="margin: 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                If you have any questions, please don't hesitate to contact us.
              </p>
              
              <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for choosing to adopt and giving ${animal_name} a loving home! ❤️
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                <strong>The SFP Portal Team</strong>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                This is an automated email. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Confirmation email sent to ${email} for application ${application_id}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }
    return { success: false, message: error.message };
  }
};

/**
 * Send new application notification email to admin and interviewers
 */
export const sendNewApplicationNotificationEmail = async (applicationData, recipients) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('📧 Email not sent (SendGrid not configured)');
    return { success: false, message: 'SendGrid not configured' };
  }

  if (!recipients || recipients.length === 0) {
    console.log('⚠️  No recipients for new application notification');
    return { success: false, message: 'No recipients' };
  }

  const { 
    applicant_name, 
    applicant_email,
    animal_id,
    animal_name,
    application_id,
    phone_number,
    address,
  } = applicationData;

  // Send to each recipient individually
  const results = [];
  
  for (const recipient of recipients) {
    const msg = {
      to: recipient.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@sfp-portal.com',
      subject: `New Adoption Application - ${animal_name} (${animal_id})`,
      text: `
Hello ${recipient.name},

A new adoption application has been submitted for ${animal_name} (ID: ${animal_id}).

Application Details:
--------------------
Application ID: ${application_id}
Applicant Name: ${applicant_name}
Applicant Email: ${applicant_email}
Phone Number: ${phone_number || 'Not provided'}
Address: ${address || 'Not provided'}

Please log in to the SFP Portal to review the application and take appropriate action.

Best regards,
The SFP Portal System

---
This is an automated email. Please do not reply to this email.
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Adoption Application</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; background-color: #4C51A4; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                New Adoption Application 🐾
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Hello <strong>${recipient.name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                A new adoption application has been submitted for <strong>${animal_name}</strong> (ID: ${animal_id}).
              </p>
              
              <!-- Application Details Card -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #4C51A4; padding: 25px; margin: 20px 0;">
                <h2 style="margin: 0 0 20px 0; color: #4C51A4; font-size: 20px;">
                  Application Details
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 140px;">
                      <strong>Application ID:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${application_id}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>Applicant Name:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${applicant_name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>Email:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      <a href="mailto:${applicant_email}" style="color: #4C51A4; text-decoration: none;">
                        ${applicant_email}
                      </a>
                    </td>
                  </tr>
                  ${phone_number ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>Phone:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${phone_number}
                    </td>
                  </tr>
                  ` : ''}
                  ${address ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>Address:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${address}
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1565c0; font-size: 14px;">
                  💡 <strong>Action Required:</strong><br/>
                  Please log in to the SFP Portal to review the full application details and take appropriate action.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                <strong>The SFP Portal System</strong>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                This is an automated email. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ New application notification sent to ${recipient.email}`);
      results.push({ recipient: recipient.email, success: true });
    } catch (error) {
      console.error(`❌ Error sending notification to ${recipient.email}:`, error);
      if (error.response) {
        console.error('SendGrid error response:', error.response.body);
      }
      results.push({ recipient: recipient.email, success: false, error: error.message });
    }
  }

  const allSuccessful = results.every(r => r.success);
  return { 
    success: allSuccessful, 
    message: allSuccessful ? 'All emails sent successfully' : 'Some emails failed',
    details: results
  };
};

/**
 * Send interview rescheduled/updated email to applicant
 */
export const sendInterviewUpdatedEmail = async (interviewData) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('📧 Email not sent (SendGrid not configured):', interviewData.applicant_email);
    return { success: false, message: 'SendGrid not configured' };
  }

  const {
    applicant_email,
    applicant_name,
    animal_name,
    animal_id,
    interview_date,
    interview_time,
    interview_location,
    interview_notes,
    interviewer_name,
    interviewer_email,
  } = interviewData;

  // Format date and time for display
  const formattedDate = new Date(interview_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const msg = {
    to: applicant_email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@sfp-portal.com',
    subject: `Interview Updated - ${animal_name} (${animal_id})`,
    text: `
Dear ${applicant_name},

Your interview for adopting ${animal_name} (ID: ${animal_id}) has been updated with new details.

Updated Interview Details:
--------------------------
Date: ${formattedDate}
Time: ${interview_time}
Location: ${interview_location || 'To be confirmed'}
Interviewer: ${interviewer_name}
Interviewer Contact: ${interviewer_email}

${interview_notes ? `Additional Notes:\n${interview_notes}\n` : ''}

What to Expect:
---------------
- The interview typically lasts 30-45 minutes
- We'll discuss your application and answer any questions you may have
- This is also a great opportunity for you to learn more about ${animal_name}
- Please bring a valid photo ID

If you need to reschedule or have any questions, please contact ${interviewer_name} at ${interviewer_email}.

We look forward to meeting you!

Best regards,
The SFP Portal Team

---
This is an automated email. Please do not reply to this email.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Updated</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; background-color: #f59e0b; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Interview Updated! 🔔
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear <strong>${applicant_name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Your interview for adopting <strong>${animal_name}</strong> (ID: ${animal_id}) has been <strong>updated</strong> with new details.
              </p>
              
              <!-- Interview Details Card -->
              <div style="background-color: #fff3cd; border-left: 4px solid #f59e0b; padding: 25px; margin: 20px 0;">
                <h2 style="margin: 0 0 20px 0; color: #f59e0b; font-size: 20px;">
                  Updated Interview Details
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 120px;">
                      <strong>📅 Date:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${formattedDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>🕐 Time:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${interview_time}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>📍 Location:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${interview_location || 'To be confirmed'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>👤 Interviewer:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${interviewer_name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>📧 Contact:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      <a href="mailto:${interviewer_email}" style="color: #4C51A4; text-decoration: none;">
                        ${interviewer_email}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              ${interview_notes ? `
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>📝 Additional Notes:</strong><br/>
                  ${interview_notes}
                </p>
              </div>
              ` : ''}
              
              <h2 style="margin: 30px 0 20px 0; color: #4C51A4; font-size: 20px;">
                What to Expect
              </h2>
              
              <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                <li style="margin-bottom: 10px;">
                  The interview typically lasts 30-45 minutes
                </li>
                <li style="margin-bottom: 10px;">
                  We'll discuss your application and answer any questions you may have
                </li>
                <li style="margin-bottom: 10px;">
                  This is also a great opportunity for you to learn more about ${animal_name}
                </li>
                <li style="margin-bottom: 10px;">
                  Please bring a valid photo ID
                </li>
              </ul>
              
              <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1565c0; font-size: 14px;">
                  💡 <strong>Need to reschedule?</strong><br/>
                  Please contact ${interviewer_name} at 
                  <a href="mailto:${interviewer_email}" style="color: #1565c0; text-decoration: none;">
                    ${interviewer_email}
                  </a>
                </p>
              </div>
              
              <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                We look forward to meeting you! 🎉
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                <strong>The SFP Portal Team</strong>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                This is an automated email. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Interview updated email sent to ${applicant_email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending interview updated email:', error);
    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }
    return { success: false, message: error.message };
  }
};

/**
 * Send interview scheduled email to applicant
 */
export const sendInterviewScheduledEmail = async (interviewData) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('📧 Email not sent (SendGrid not configured):', interviewData.applicant_email);
    return { success: false, message: 'SendGrid not configured' };
  }

  const {
    applicant_email,
    applicant_name,
    animal_name,
    animal_id,
    interview_date,
    interview_time,
    interview_location,
    interview_notes,
    interviewer_name,
    interviewer_email,
  } = interviewData;

  // Format date and time for display
  const formattedDate = new Date(interview_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const msg = {
    to: applicant_email,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@sfp-portal.com',
    subject: `Interview Scheduled - ${animal_name} (${animal_id})`,
    text: `
Dear ${applicant_name},

Great news! Your interview for adopting ${animal_name} (ID: ${animal_id}) has been scheduled.

Interview Details:
------------------
Date: ${formattedDate}
Time: ${interview_time}
Location: ${interview_location || 'To be confirmed'}
Interviewer: ${interviewer_name}
Interviewer Contact: ${interviewer_email}

${interview_notes ? `Additional Notes:\n${interview_notes}\n` : ''}

What to Expect:
---------------
- The interview typically lasts 30-45 minutes
- We'll discuss your application and answer any questions you may have
- This is also a great opportunity for you to learn more about ${animal_name}
- Please bring a valid photo ID

If you need to reschedule or have any questions, please contact ${interviewer_name} at ${interviewer_email}.

We look forward to meeting you!

Best regards,
The SFP Portal Team

---
This is an automated email. Please do not reply to this email.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Scheduled</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 30px; background-color: #10b981; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Interview Scheduled! 📅
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear <strong>${applicant_name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Great news! Your interview for adopting <strong>${animal_name}</strong> (ID: ${animal_id}) has been scheduled.
              </p>
              
              <!-- Interview Details Card -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #10b981; padding: 25px; margin: 20px 0;">
                <h2 style="margin: 0 0 20px 0; color: #10b981; font-size: 20px;">
                  Interview Details
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 120px;">
                      <strong>📅 Date:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${formattedDate}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>🕐 Time:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${interview_time}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>📍 Location:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${interview_location || 'To be confirmed'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>👤 Interviewer:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      ${interviewer_name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                      <strong>📧 Contact:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                      <a href="mailto:${interviewer_email}" style="color: #4C51A4; text-decoration: none;">
                        ${interviewer_email}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

              ${interview_notes ? `
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>📝 Additional Notes:</strong><br/>
                  ${interview_notes}
                </p>
              </div>
              ` : ''}
              
              <h2 style="margin: 30px 0 20px 0; color: #4C51A4; font-size: 20px;">
                What to Expect
              </h2>
              
              <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #333333; font-size: 16px; line-height: 1.8;">
                <li style="margin-bottom: 10px;">
                  The interview typically lasts 30-45 minutes
                </li>
                <li style="margin-bottom: 10px;">
                  We'll discuss your application and answer any questions you may have
                </li>
                <li style="margin-bottom: 10px;">
                  This is also a great opportunity for you to learn more about ${animal_name}
                </li>
                <li style="margin-bottom: 10px;">
                  Please bring a valid photo ID
                </li>
              </ul>
              
              <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #1565c0; font-size: 14px;">
                  💡 <strong>Need to reschedule?</strong><br/>
                  Please contact ${interviewer_name} at 
                  <a href="mailto:${interviewer_email}" style="color: #1565c0; text-decoration: none;">
                    ${interviewer_email}
                  </a>
                </p>
              </div>
              
              <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                We look forward to meeting you! 🎉
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                <strong>The SFP Portal Team</strong>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                This is an automated email. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Interview scheduled email sent to ${applicant_email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending interview scheduled email:', error);
    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }
    return { success: false, message: error.message };
  }
};
