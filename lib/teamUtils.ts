/**
 * Utility functions for team member operations
 */

/**
 * Generate URL-friendly slug from name
 * Example: "John Doe" -> "john-doe"
 */
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/-+/g, '-'); // Replace multiple dashes with single dash
}

/**
 * Format join date to Indonesian format
 * Example: "2024-01-15" -> "Bergabung sejak Januari 2024"
 */
export function formatJoinDate(dateString: string): string {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `Bergabung sejak ${month} ${year}`;
}

/**
 * Truncate text to specified length with ellipsis
 * Example: truncateText("Long text here", 10) -> "Long text..."
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get initials from name for avatar fallback
 * Example: "John Doe" -> "JD"
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
