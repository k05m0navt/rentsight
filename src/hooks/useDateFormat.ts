/**
 * Custom hook for formatting dates in DD.MM.YYYY format
 */

interface UseDateFormatReturn {
  formatDate: (date: Date | string | null | undefined) => string;
  formatDateTime: (date: Date | string | null | undefined) => string;
}

export function useDateFormat(): UseDateFormatReturn {
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Not set';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'Invalid date';

      // Format as DD.MM.YYYY
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const formatDateTime = (date: Date | string | null | undefined): string => {
    if (!date) return 'Not set';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'Invalid date';

      // Format as DD.MM.YYYY at HH:MM
      const formattedDate = formatDate(dateObj);
      const time = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
      });

      return `${formattedDate} at ${time}`;
    } catch (error) {
      console.error('Error formatting date-time:', error);
      return 'Invalid date';
    }
  };

  return {
    formatDate,
    formatDateTime,
  };
}
