export const createBlobFromImagePath = async (imagePath) => {
    const response = await fetch(imagePath);
    const imageBuffer = await response.arrayBuffer();
    const blob = new Blob([imageBuffer], { type: 'image/webp' });
    return blob;
};

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
                        reject('Failed to create WebP Blob');
                    }
                }, 'image/webp', 0.8);
            };
            img.src = event.target.result;
        };
        reader.onerror = () => reject('Failed to read file');
        reader.readAsDataURL(file);
    });
};