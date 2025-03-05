import React, { useState, useEffect } from 'react';
import { apiClient, ShortUrlResponse } from './apiClient';
import './Shortener.css';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface OtherLink {
  id: string;
  slug: string;
  shortUrl: string;
  longUrl: string;
}

const Shortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otherLinks, setOtherLinks] = useState<OtherLink[]>([]);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [updateSlug, setUpdateSlug] = useState('');

  const fetchOtherLinks = async (ownerId: string) => {
    try {
      const response = await apiClient.findShortsOfUser(ownerId);

      const links = response.data.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        shortUrl: item.shortUrl, 
        longUrl: item.url
      }));
      setOtherLinks(links);
    } catch (error) {
      console.error('Error fetching other links:', error);
      setErrorMessage('Failed to fetch your links.');
    }
  };

  useEffect(() => {
    const storedOwnerId = localStorage.getItem('ownerId');
    if (storedOwnerId) {
      fetchOtherLinks(storedOwnerId);
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {

      const storedOwnerId = localStorage.getItem('ownerId');
      const payload = {
        url,
          ...(storedOwnerId && { ownerId: storedOwnerId }),
      };

      const data: ShortUrlResponse = await apiClient.createShort(payload);


      if (!storedOwnerId && data.data.attributes.ownerId) {
        localStorage.setItem('ownerId', data.data.attributes.ownerId);
      }


      setShortUrl(data.data.attributes.shortUrl);
      setSuccessMessage(`Success, Here's your short URL:`);
      
      const ownerId = storedOwnerId || data.data.attributes.ownerId;
      if (ownerId) {
        fetchOtherLinks(ownerId);
      }


    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to shorten URL. '+ error);
    }
  };


  const handleInlineUpdate = async (id: string) => {
    if (!id) {
      setErrorMessage('No short URL selected for update.');
      return;
    }
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const storedOwnerId = localStorage.getItem('ownerId');
      const updateData = {
        slug: updateSlug,
        ownerId: storedOwnerId,
      };
      const data: ShortUrlResponse = await apiClient.updateShort(id, updateData);
      setSuccessMessage('Slug updated successfully.');
      if (storedOwnerId) {
        fetchOtherLinks(storedOwnerId);
      }

      setUpdateSlug('');
      setUpdateId(null);
    } catch (error: any) {
      console.error(error);
      setErrorMessage('Failed to update slug. ' + error.message);
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
          type="text" 
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
              
              <th>Long URL</th>
              <th>Short URL</th>
            </tr>
          </thead>
          <tbody>
            {otherLinks.length > 0 ? (
              otherLinks.map((link, i) => (
                <tr key={i}>
                  
                  <td>{link.longUrl}</td>
                  <td>
                    
                    {updateId === link.id ? (
                      <>
                        <input
                          type="text"
                          value={updateSlug}
                          onChange={(e) => setUpdateSlug(e.target.value)}
                          placeholder="New slug"
                          className="input"
                          style={{ marginLeft: '5px' }}
                        />
                        
                        <button
                          type="button"
                          onClick={() => handleInlineUpdate(link.id)}
                          className="button"
                          style={{ marginRight: '5px' }}
                          title="Save"
                        >
                           <FaSave size={16} />
                        </button>
                       
                        <button
                          type="button"
                          onClick={() => {
                            setUpdateId(null);
                            setUpdateSlug('');
                          }}
                          className="button"
                          title="Cancel"
                        >
                          <FaTimes size={16} />
                        </button>
                      </>
                    ) : (
                      
                      <div>
                      <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                        {link.shortUrl}
                      </a>
                      
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Edit slug clicked for id:', link.id);
                          setUpdateId(link.id);
                          setUpdateSlug(link.slug);
                        }}
                        className="button"
                        title="Edit Slug"
                        style={{ marginLeft: '10px' }}
                      >
                        <FaEdit size={16} />
                      </button>
                      </div>
                    )}
                  

                  </td>
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
