export const generateStrongPassword = () => {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?';
  
  const length = 12; 
  const includeUppercase = true;
  const includeNumbers = true;
  const includeSymbols = true;

  let allowedChars = lowercaseChars;
  let password = '';

  if (includeUppercase) {
    allowedChars += uppercaseChars;
  }

  if (includeNumbers) {
    allowedChars += numberChars;
  }

  if (includeSymbols) {
    allowedChars += symbolChars;
  }

  const allowedCharsLength = allowedChars.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedCharsLength);
    password += allowedChars.charAt(randomIndex);
  }

  return password;
}

