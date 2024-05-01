function levenshteinDistance(a, b) {
    const matrix = [];

    // Initialize matrix with 0s
    for (let i = 0; i <= a.length; i++) {
        matrix.push([i]);
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the matrix
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[a.length][b.length];
}

function findMatches(songs, query) {
    const threshold = 2; // Adjust threshold as needed

    const matches = songs.filter(song => {
        const distance = levenshteinDistance(song.name.toLowerCase(), query.toLowerCase());
        return distance <= threshold;
    });

    return matches;
}

module.exports = { findMatches };
