export const FnlocalStorage = () => {
    const setItem = (key, data) => localStorage.setItem(key, data);

    const getItem = (key) => localStorage.getItem(key);

    const removeItem = (key) => localStorage.removeItem(key);

    return { setItem, getItem, removeItem };
};
