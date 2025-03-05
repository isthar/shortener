import React, { useState } from 'react';
import { apiClient, ShortUrlResponse } from './apiClient';
import './Shortener.css';


const Shortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otherLinks, setOtherLinks] = useState<{ shortUrl: string; longUrl: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const data: ShortUrlResponse = await apiClient.createShort(url);
      setShortUrl(data.shortUrl);
      setSuccessMessage('URL shortened successfully!');
      if (data.otherLinks) {
        setOtherLinks(data.otherLinks);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to shorten URL.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <p className="subtitle">Enter The URL to shorten</p>
      <form onSubmit={handleSubmit} className="form">
        <input 
          type="url" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          required
          className="input"
        />
        <button type="submit" className="button">Shorten</button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {shortUrl && (
        <div className="generated">
          <span>{shortUrl}</span>
          <button onClick={copyToClipboard} className="copy">Copy</button>
        </div>
      )}
      <div className="other">
        <h2>Your other short links</h2>
        <table>
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Long URL</th>
            </tr>
          </thead>
          <tbody>
            {otherLinks.length > 0 ? (
              otherLinks.map((link, i) => (
                <tr key={i}>
                  <td>
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                      {link.shortUrl}
                    </a>
                  </td>
                  <td>{link.longUrl}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="no-links">No links available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shortener;
