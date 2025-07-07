import zxcvbn from "zxcvbn";

export const passwordCheckFormat = (password) => {
    const spaceRegex = /\s/;
    const specialCharRegex = /[^\w\s]/;
    if (password.length < 9 ||
        password.length > 20 ||
        spaceRegex.test(password) ||
        specialCharRegex.test(password) || zxcvbn(password) < 3) {
        return true
    } else {
        return false
    }
}

export const emailCheckFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 50) {
        return true;
    } else {
        return false;
    }
}