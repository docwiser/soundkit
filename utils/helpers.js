import { formatDistanceToNow } from 'date-fns';

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return '';
  }
};

export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDetailedDuration = (seconds) => {
  if (!seconds) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
  }
  
  return parts.join(', ');
};

export const formatViewCount = (count) => {
  if (!count || count === 0) return '';
  
  if (count >= 1000000000000) { // Trillion
    return `${(count / 1000000000000).toFixed(1)}T`;
  }
  if (count >= 1000000000) { // Billion
    return `${(count / 1000000000).toFixed(1)}B`;
  }
  if (count >= 1000000) { // Million
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) { // Thousand
    return `${(count / 1000).toFixed(1)}K`;
  }
  
  return count.toString();
};

export const getImageUrl = (imageArray, quality = 'high') => {
  if (!imageArray || !Array.isArray(imageArray) || imageArray.length === 0) {
    return null;
  }

  // Try to find the requested quality
  const qualityMap = {
    low: ['50x50', '150x150'],
    medium: ['150x150', '300x300'],
    high: ['500x500', '300x300', '150x150']
  };

  const preferredQualities = qualityMap[quality] || qualityMap.high;
  
  for (const preferredQuality of preferredQualities) {
    const image = imageArray.find(img => img.quality === preferredQuality);
    if (image) {
      return image.url;
    }
  }

  // Fallback to first available image
  return imageArray[0]?.url || null;
};

export const createShareLink = (songId, songTitle) => {
  const encodedTitle = encodeURIComponent(songTitle);
  return `https://soundkit.susantswain.com/player?id=${songId}&title=${encodedTitle}`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getArtistNames = (artists) => {
  if (!artists) return 'Unknown Artist';
  
  if (artists.primary && artists.primary.length > 0) {
    return artists.primary.map(artist => artist.name).join(', ');
  }
  
  if (artists.all && artists.all.length > 0) {
    return artists.all.map(artist => artist.name).join(', ');
  }
  
  if (typeof artists === 'string') {
    return artists;
  }
  
  return 'Unknown Artist';
};

export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

export const formatSongYear = (year) => {
  if (!year) return '';
  
  const currentYear = new Date().getFullYear();
  const songYear = parseInt(year);
  const yearsDiff = currentYear - songYear;
  
  if (yearsDiff === 0) return 'This year';
  if (yearsDiff === 1) return '1 year ago';
  if (yearsDiff < 12) return `${yearsDiff} years ago`;
  
  return `${songYear}`;
};