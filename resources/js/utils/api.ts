import { ApiResponse } from '@/components/project-components/DataAnalysisComponents/types';

export async function makeApiCall<
    T = ApiResponse,
    U = Record<string, unknown>
>(
    url: string,
    data: U,
    options: {
        showSuccessAlert?: boolean;
        customSuccessMessage?: string;
    } = {},
): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify(data),
        });

        const responseText = await response.text();
        let responseData: T & { success: boolean; message?: string };

        try {
            responseData = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error(
                `Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}\n\nResponse: ${responseText.substring(0, 500)}...`,
            );
        }

        if (!response.ok) {
            throw new Error(responseData.message || 'Unknown error');
        }

        if (!responseData.success) {
            throw new Error('Operation failed');
        }

        if (options.showSuccessAlert && options.customSuccessMessage) {
            alert(options.customSuccessMessage);
        }

        return responseData;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`API call failed: ${message}`);
    }
}
