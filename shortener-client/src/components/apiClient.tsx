export interface ShortUrlResponse {
  shortUrl: string;
  otherLinks?: { shortUrl: string; longUrl: string }[];
}
  
export const apiClient = {
    createShort: async (url: string): Promise<ShortUrlResponse> => {
      const response = await fetch('http://localhost:3000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error('Error creating short URL');
      return response.json();
    },
    findShortsOfUser: async (userId: string): Promise<{ shortUrl: string; longUrl: string }[]> => {
      const response = await fetch(`http://localhost:3000/api/find-shorts-of/${userId}`);
      if (!response.ok) throw new Error('Error fetching user links');
      return response.json();
    },
    updateShort: async (slug: string, updateData: any): Promise<ShortUrlResponse> => {
      const response = await fetch(`http://localhost:3000/api/update-short/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Error updating short URL');
      return response.json();
    },
};
  