import { FilterConfig, InputTag, SortConfig } from './types';

// Calculate time headers and slots
export const calculateTimeHeaders = (baseTime: string, jmInput: number) => {
    if (!baseTime || !jmInput || jmInput <= 0) {
        return { headers: [], slots: [] };
    }

    const baseDate = new Date(baseTime);
    if (isNaN(baseDate.getTime())) {
        return { headers: [], slots: [] };
    }

    // For jmInput intervals, we need (jmInput - 1) divisions to include start and end times
    // Example: jmInput = 4 means 4 time points with 3 intervals between them
    const intervalMinutes = jmInput === 1 ? 0 : 120 / (jmInput - 1); // 2 hours divided by (jm_input - 1)
    const headers = [];
    const slots = [];

    for (let i = 0; i < jmInput; i++) {
        const time = new Date(baseDate);
        time.setMinutes(time.getMinutes() + i * intervalMinutes);

        headers.push(
            time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),
        );

        slots.push(new Date(time));
    }

    return { headers, slots };
};

// Apply filtering and sorting for a specific jm group
export const getFilteredAndSortedTags = (jm: number, tags: InputTag[], filters: FilterConfig, sortConfig: SortConfig) => {
    let filtered = [...tags];

    // Apply filters
    if (filters.tag_no) {
        filtered = filtered.filter((tag) => tag.tag_no.toLowerCase().includes(filters.tag_no.toLowerCase()));
    }
    if (filters.description) {
        filtered = filtered.filter((tag) => tag.description.toLowerCase().includes(filters.description.toLowerCase()));
    }
    if (filters.unit_name) {
        filtered = filtered.filter((tag) => tag.unit_name.toLowerCase().includes(filters.unit_name.toLowerCase()));
    }

    // Apply sorting
    filtered.sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (sortConfig.field) {
            case 'tag_no':
                aValue = a.tag_no || '';
                bValue = b.tag_no || '';
                break;
            case 'description':
                aValue = a.description || '';
                bValue = b.description || '';
                break;
            case 'unit_name':
                aValue = a.unit_name || '';
                bValue = b.unit_name || '';
                break;
            default:
                return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            const comparison = aValue.localeCompare(bValue);
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return filtered;
};

// Process existing inputs for pre-population
export const processExistingInputs = (
    processedTags: InputTag[],
    existingInputs: any,
    selectedDateTime: string,
    calculateTimeHeaders: (dateTime: string, jm: number) => { headers: string[]; slots: Date[] },
) => {
    const newInputValuesByJm: { [jm: number]: { [key: string]: string } } = {};

    if (Object.keys(existingInputs).length > 0) {
        processedTags.forEach((tag: InputTag, tagIndex: number) => {
            const safeTagNo = tag?.tag_no || `empty-tag-${tagIndex}`;

            if (tag?.tag_no) {
                const jm = tag.jm_input || 6;
                const { slots } = calculateTimeHeaders(selectedDateTime, jm);

                if (!newInputValuesByJm[jm]) {
                    newInputValuesByJm[jm] = {};
                }

                slots.forEach((slot: Date, timeIndex: number) => {
                    // Format the slot time to match database format
                    const year = slot.getFullYear();
                    const month = String(slot.getMonth() + 1).padStart(2, '0');
                    const day = String(slot.getDate()).padStart(2, '0');
                    const hours = String(slot.getHours()).padStart(2, '0');
                    const minutes = String(slot.getMinutes()).padStart(2, '0');
                    const seconds = String(slot.getSeconds()).padStart(2, '0');
                    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                    const existingKey = `${tag.tag_no}_${formattedDateTime}`;
                    const inputKey = `${safeTagNo}_${timeIndex}`;

                    if (existingInputs[existingKey]) {
                        const value = existingInputs[existingKey].value;
                        // Show "NaN" for null values, otherwise show the actual value
                        newInputValuesByJm[jm][inputKey] = value === null ? 'NaN' : String(value);
                    }
                });
            }
        });
    }

    return newInputValuesByJm;
};

// Group tags by jm_input
export const groupTagsByJmInput = (
    processedTags: InputTag[],
    selectedDateTime: string,
    calculateTimeHeaders: (dateTime: string, jm: number) => { headers: string[]; slots: Date[] },
) => {
    const grouped: { [jm: number]: InputTag[] } = {};
    const headersMap: { [jm: number]: string[] } = {};
    const slotsMap: { [jm: number]: Date[] } = {};

    processedTags.forEach((tag: InputTag) => {
        const jm = tag.jm_input || 6;
        if (!grouped[jm]) {
            grouped[jm] = [];
            const { headers, slots } = calculateTimeHeaders(selectedDateTime, jm);
            headersMap[jm] = headers;
            slotsMap[jm] = slots;
        }
        grouped[jm].push(tag);
    });

    return { grouped, headersMap, slotsMap };
};
