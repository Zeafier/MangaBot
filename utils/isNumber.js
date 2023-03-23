module.exports = (text) => {
    try {
        parseInt(text);
        return true;
    } catch (error) {
        return false;
    }
}