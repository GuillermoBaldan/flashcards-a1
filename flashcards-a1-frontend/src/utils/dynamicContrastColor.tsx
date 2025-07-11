const sRGBtoLinear = (color: number) => {
  color /= 255;
  return color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4);
};

const getLuminance = (hexcolor: string) => {
  console.log(`getLuminance input: ${hexcolor}`);
  if (!hexcolor || typeof hexcolor !== 'string') {
    console.log(`Invalid hexcolor input: ${hexcolor}. Returning luminance 0.`);
    return 0; // Default to 0 (black luminance) for invalid or undefined inputs initially, will be handled by getContrastColor.
  }

  const cleanHex = hexcolor.startsWith('#') ? hexcolor.slice(1) : hexcolor;
  console.log(`Cleaned hex: ${cleanHex}`);

  // Check if it's a valid 3 or 6 digit hex code
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex) && !/^[0-9A-Fa-f]{3}$/.test(cleanHex)) {
    // If it's not a valid hex, assume it's meant to be a light color like white
    // and return a high luminance so that black text is chosen for contrast.
    console.log(`Invalid hex format for ${cleanHex}. Assuming light color, returning luminance 1.`);
    return 1; // Luminance of #FFFFFF (white)
  }

  let r = parseInt(cleanHex.substring(0, 2), 16);
  let g = parseInt(cleanHex.substring(2, 4), 16);
  let b = parseInt(cleanHex.substring(4, 6), 16);

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  }
  console.log(`RGB: (${r}, ${g}, ${b})`);

  const R = sRGBtoLinear(r);
  const G = sRGBtoLinear(g);
  const B = sRGBtoLinear(b);

  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  console.log(`Calculated luminance: ${luminance}`);
  return luminance;
};

const getContrastRatio = (luminance1: number, luminance2: number) => {
  const L1 = Math.max(luminance1, luminance2);
  const L2 = Math.min(luminance1, luminance2);
  const ratio = (L1 + 0.05) / (L2 + 0.05);
  console.log(`Contrast ratio (L1: ${luminance1}, L2: ${luminance2}): ${ratio}`);
  return ratio;
};

const getContrastColor = (hexcolor: string) => {
  console.log(`getContrastColor input: ${hexcolor}`);
  const backgroundLuminance = getLuminance(hexcolor);
  const blackLuminance = 0; // Luminance of #000000
  const whiteLuminance = 1; // Luminance of #FFFFFF

  const contrastWithBlack = getContrastRatio(backgroundLuminance, blackLuminance);
  const contrastWithWhite = getContrastRatio(backgroundLuminance, whiteLuminance);

  let chosenColor = contrastWithBlack > contrastWithWhite ? 'black' : 'white';
  console.log(`Initial chosen color: ${chosenColor}`);

  // Failsafe: If background is very bright, always ensure black text.
  // This addresses cases where luminance calculation might slightly err or
  // the 'best' contrast is still visually poor white on white.
  if (backgroundLuminance > 0.8 && chosenColor === 'white') { // 0.8 is a high luminance threshold
      console.log(`Failsafe triggered. Forcing black text for bright background (luminance: ${backgroundLuminance}).`);
      return 'black';
  }

  console.log(`Final chosen color: ${chosenColor}`);
  return chosenColor;
};

export default getContrastColor;
