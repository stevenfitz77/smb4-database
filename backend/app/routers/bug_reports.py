import os
import resend
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
    api_key = os.getenv("RESEND_API_KEY")
    recipient = os.getenv("REPORT_RECIPIENT_EMAIL")

    if not api_key or not recipient:
        raise HTTPException(status_code=500, detail="Email is not configured on the server")

    resend.api_key = api_key

    body_html = f"""
    <p><strong>New bug report from SMB4 Database</strong></p>
    <p>{report.message}</p>
    <p><strong>Page:</strong> {report.page_url or 'not provided'}</p>
    <p><strong>Contact email:</strong> {report.contact_email or 'not provided'}</p>
    """

    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": recipient,
            "subject": "SMB4 Database - Bug Report",
            "html": body_html,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send report: {str(e)}")

    return {"detail": "Bug report sent successfully"}