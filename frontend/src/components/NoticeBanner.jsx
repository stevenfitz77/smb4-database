import { useState } from 'react';
import { SITE_NOTICE } from '../constants';
import './NoticeBanner.css';

function NoticeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!SITE_NOTICE || dismissed) return null;

  return (
    <div className="notice-banner">
      <span>{SITE_NOTICE}</span>
      <button onClick={() => setDismissed(true)} className="notice-dismiss" aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}

export default NoticeBanner;