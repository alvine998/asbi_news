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