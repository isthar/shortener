export interface ShortUrlResponse {
  data: {
    type: string;
    id: string;
    attributes: {
      slug: string;
      url: string;
      ownerId: string;
      shortUrl: string;
    };
  }
}
  
export const apiClient = {
    createShort: async ( payload: {url:string, ownerId?: string }): Promise<ShortUrlResponse> => {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating short URL');
      }
      return response.json();
    },
    findShortsOfUser: async (userId: string): Promise<{data:{ url: string; shortUrl: string }[]}> => {
      const response = await fetch(`/api/find-shorts-of/${userId}`);
      if (!response.ok) throw new Error('Error fetching user links');
      return response.json();
    },
    updateShort: async (slug: string, updateData: any): Promise<ShortUrlResponse> => {
      const response = await fetch(`/api/update-short/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating short URL');
      }
      return response.json();
    },
};
  