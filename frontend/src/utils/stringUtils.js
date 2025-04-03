export function capitalizeString(str) {
    // Sprawdzenie czy string nie jest pusty
    if (!str || str.length === 0) {
      return str;
    }
    
    // Zamień pierwszą literę na dużą, a resztę na małe
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }