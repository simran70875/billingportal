export const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Error setting local storage:", error);
  }
};

export const getLocalStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? item : null;
  } catch (error) {
    console.error("Error getting local storage:", error);
    return null;
  }
};

export const removeLocalStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing local storage:", error);
  }
};
