
const validateEmail = (email : string ) : boolean => {
  const re  = /\b[A-Za-z0-9\\.]*@[A-Za-z]{1}[A-Za-z0-9]*\.[A-Za-z]{2,3}\b/;

  return re.test(email);
};

const validatePassword = (password : string) :boolean => {
  const checkSpecial = /[@!#?\]]+/.test(password);
  const checkUpper = /[A-Z]+/.test(password);
  const checkLower = /[a-z]+/.test(password);

  return password.length >= 10 &&
  checkSpecial &&
  checkUpper &&
  checkLower;
};

export default {
  validateEmail,
  validatePassword
};
