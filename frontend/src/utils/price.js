// price.js

export function shortenPrice(price) {
  if (!price || price.length < 4) {
    return price; // If price is too short to truncate, return it as is
  }

  const start = price.slice(0, 4); // Get the first 4 characters

  return `${start}...`;
}
