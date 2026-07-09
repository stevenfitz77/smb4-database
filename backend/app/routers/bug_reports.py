import os
import smtplib
from email.mime.text import MIMEText
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(
    prefix="/bug-reports",
    tags=["bug-reports"]
)

class BugReport(BaseModel):
    message: str
    page_url: Optional[str] = None
    contact_email: Optional[str] = None

@router.post("/")
def submit_bug_report(report: BugReport):
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_APP_PASSWORD")
    recipient = os.getenv("REPORT_RECIPIENT_EMAIL")

    if not all([smtp_email, smtp_password, recipient]):
        raise HTTPException(status_code=500, detail="Email is not configured on the server")

    body_lines = [
        "New bug report from SMB4 Database:",
        "",
        report.message,
        "",
        f"Page: {report.page_url or 'not provided'}",
        f"Contact email: {report.contact_email or 'not provided'}",
    ]
    body = "\n".join(body_lines)

    msg = MIMEText(body)
    msg["Subject"] = "SMB4 Database - Bug Report"
    msg["From"] = smtp_email
    msg["To"] = recipient

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, recipient, msg.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send report: {str(e)}")

    return {"detail": "Bug report sent successfully"}