export const getCurrentDateString = (): string => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const convertDateForComparison = (dateString: string): string => {
    if (!dateString.includes('/')) return dateString;

    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;

    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Convert DD/MM/YY HH:MM format to YYYY-MM-DD for HTML5 date input
export const convertToDateInputValue = (dateString: string): string => {
    if (!dateString || !dateString.includes('/')) return '';

    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const fullYear = year.length === 2 ? `20${year}` : year;

    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Convert YYYY-MM-DD from HTML5 date input to DD/MM/YY HH:MM format
export const convertFromDateInputValue = (dateValue: string, currentTime?: string): string => {
    if (!dateValue) return getCurrentDateString();

    const [year, month, day] = dateValue.split('-');
    const shortYear = year.slice(-2);

    // If we have a current time, preserve it, otherwise use current time
    let timeString = '';
    if (currentTime && currentTime.includes(' ')) {
        timeString = currentTime.split(' ')[1];
    } else {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeString = `${hours}:${minutes}`;
    }

    return `${day}/${month}/${shortYear} ${timeString}`;
};

// Get current time in HH:MM format
export const getCurrentTimeString = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};
