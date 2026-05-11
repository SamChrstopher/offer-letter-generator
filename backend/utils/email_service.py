import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formatdate
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USERNAME)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def send_reset_email(to_email: str, reset_token: str) -> bool:
    """Send password reset email"""
    try:
        reset_link = f"{FRONTEND_URL}/reset-password?token={reset_token}"
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Password Reset Request - Offer Letter Generator"
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        msg['Date'] = formatdate(localtime=True)
        msg['Message-ID'] = f"<{reset_token[:16]}.offerletter@mirafra.com>"
        
        # HTML content
        html_content = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ margin-top: 20px; font-size: 12px; color: #666; text-align: center; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your Offer Letter Generator account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center;">
                        <a href="{reset_link}" class="button">Reset Password</a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">{reset_link}</p>
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong>
                        <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message, please do not reply to this email.</p>
                        <p>© 2026 Offer Letter Generator. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Plain text fallback
        text_content = f"""
        Password Reset Request - Offer Letter Generator
        
        We received a request to reset your password for your Offer Letter Generator account.
        
        To reset your password, visit this link:
        {reset_link}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        
        This is an automated message, please do not reply to this email.
        """
        
        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"Password reset email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False