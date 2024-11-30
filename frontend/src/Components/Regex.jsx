export const regexFullName = new RegExp( /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/);
export const regexEmail = new RegExp(/^(?!.*?\.\.)(?!.*?\.(_|_\.|\._))([a-zA-Z0-9]+[a-zA-Z]*)(?:[._][a-zA-Z0-9]+)?(?:[._]?[a-zA-Z0-9]+)?@[a-zA-Z.]+(?:_[a-zA-Z0-9]+)?\.[a-zA-Z]{2,3}$/);
export const regexMobileNo = new RegExp(/^[6-9][0-9]{9}$/);
export const regexPassword = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/);