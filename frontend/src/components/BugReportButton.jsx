import { useState } from 'react';
import { submitBugReport } from '../api/client';
import './BugReportButton.css';

function BugReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitBugReport({
        message,
        page_url: window.location.href,
        contact_email: contactEmail || null,
      });
      setStatus('sent');
      setMessage('');
      setContactEmail('');
    } catch (err) {
      setStatus('error');
    }
  };

  const closeAndReset = () => {
    setIsOpen(false);
    setStatus('idle');
  };

  return (
    <>
      <button className="bug-report-fab" onClick={() => setIsOpen(true)}>
        Report an Issue
      </button>

      {isOpen && (
        <div className="bug-report-overlay" onClick={closeAndReset}>
          <div className="bug-report-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bug-report-close" onClick={closeAndReset}>✕</button>

            {status === 'sent' ? (
              <div className="bug-report-success">
                <p>Thanks! Your report was sent.</p>
                <button onClick={closeAndReset}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3>Report an Issue</h3>
                <textarea
                  placeholder="What went wrong?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                />
                <input
                  type="email"
                  placeholder="Your email (optional, if you want a reply)"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
                {status === 'error' && (
                  <p className="bug-report-error">Something went wrong sending this. Try again?</p>
                )}
                <button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Send Report'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BugReportButton;