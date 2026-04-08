import React from 'react';

/**
 * Honeypot Component
 * A hidden field that should remain empty. 
 * If a bot fills it, the submission is rejected.
 */
interface HoneypotProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Honeypot: React.FC<HoneypotProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      <label htmlFor="website_url">Website URL (leave empty)</label>
      <input
        id="website_url"
        name="website_url"
        type="text"
        value={value}
        onChange={onChange}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
};
