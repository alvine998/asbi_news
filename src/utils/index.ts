/**
 * Creates a slug from a given title.
 * The slug is created by normalizing the string, removing diacritic marks, trimming leading/trailing spaces, replacing spaces with hyphens and replacing multiple hyphens with a single one.
 * @param {string} title The title to create a slug from.
 * @returns {string} The slugified string.
 */
export const createSlug = (title: string): string => {
    return title
        .toLowerCase()                    // Convert to lowercase
        .normalize('NFD')                  // Normalize the string to separate accented characters
        .replace(/[\u0300-\u036f]/g, '')   // Remove diacritic marks (accents)
        .replace(/[^a-z0-9\s-]/g, '')      // Remove non-alphanumeric characters (except spaces and hyphens)
        .trim()                            // Trim leading/trailing spaces
        .replace(/\s+/g, '-')              // Replace spaces with hyphens
        .replace(/--+/g, '-');             // Replace multiple hyphens with a single one
};

/**
 * Shuffles an array of elements.
 * @param {T[]} array The array to shuffle.
 * @returns {T[]} The shuffled array.
 * @example
 * const array = [1, 2, 3, 4, 5];
 * const shuffled = shuffleArray(array);
 * console.log(shuffled); // [3, 1, 5, 2, 4]
 */
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }