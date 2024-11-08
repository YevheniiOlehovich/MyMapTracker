export const getBase64Image = (photoData) => {
    if (photoData && photoData.data) {
        const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(photoData.data)));
        return `data:image/jpeg;base64,${base64}`;
    }
    return null; // Якщо немає фото, повертаємо null
};
