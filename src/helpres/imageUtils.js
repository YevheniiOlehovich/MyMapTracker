export const convertImageToWebP = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Не вдалося створити WebP Blob'));
                    }
                }, 'image/webp', 0.8);
            };
            img.src = event.target.result;
        };
        reader.onerror = () => reject(new Error('Помилка читання файлу'));
        reader.readAsDataURL(file);
    });
};

export const createBlobFromImagePath = async (imagePath) => {
    try {
        const response = await fetch(imagePath);
        if (!response.ok) throw new Error('Не вдалося завантажити зображення');
        const imageBuffer = await response.arrayBuffer();
        return new Blob([imageBuffer], { type: 'image/webp' });
    } catch (error) {
        console.error('Помилка створення Blob:', error);
        throw error;
    }
};
