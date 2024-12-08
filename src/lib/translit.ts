export function translitToEnglish(str: string): string {
    const translitMap = {
        'а': 'A', 'б': 'B', 'в': 'V', 'г': 'G', 'д': 'D', 'е': 'E', 'ё': 'E', 'ж': 'ZH', 'з': 'Z', 'и': 'I', 'й': 'I', 'к': 'K', 'л': 'L', 'м': 'M', 'н': 'N', 'о': 'O', 'п': 'P', 'р': 'R', 'с': 'S', 'т': 'T', 'у': 'U', 'ф': 'F', 'х': 'KH', 'ц': 'TS', 'ч': 'CH', 'ш': 'SH', 'щ': 'SHCH', 'ъ': 'Y', 'ы': 'Y', 'ь': 'Y', 'э': 'E', 'ю': 'YU', 'я': 'YA',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E', 'Ж': 'ZH', 'З': 'Z', 'И': 'I', 'Й': 'I', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'KH', 'Ц': 'TS', 'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHCH', 'Ъ': 'Y', 'Ы': 'Y', 'Ь': 'Y', 'Э': 'E', 'Ю': 'YU', 'Я': 'YA'
    };

    return str
        .split('')
        .map(char => {
            if (translitMap[char]) {
                return translitMap[char]; // Transliterate Russian letters
            }
            if (/[a-zA-Z0-9]/.test(char)) {
                return char; // Leave English letters and digits unchanged
            }
            if (char === ' ') {
                return '_'; // Replace spaces with underscores
            }
            return ''; // Remove all other characters (punctuation, symbols)
        })
        .join('')
        .toUpperCase();
}

// Example usage:
