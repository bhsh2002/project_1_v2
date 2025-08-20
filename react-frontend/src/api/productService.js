// قاعدة بيانات وهمية للمنتجات
const mockDatabase = {
    '1234567890123': {
        id: 1,
        name: 'كوب قهوة فاخر',
        price: '15.50 د.ل',
        imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1037&q=80',
    },
    '4752224003195': {
        id: 2,
        name: 'كتاب React للمبتدئين',
        price: '45.00 د.ل',
        imageUrl: null, // منتج بدون صورة
    },
};

/**
 * دالة تحاكي جلب منتج بواسطة الباركود من الـ API
 * @param {string} barcode 
 * @returns {Promise<object>}
 */
export const fetchProductByBarcode = (barcode) => {
    console.log(`Searching for barcode: ${barcode}`);

    return new Promise((resolve, reject) => {
        // محاكاة تأخير الشبكة لمدة 1 ثانية
        setTimeout(() => {
            const product = mockDatabase[barcode];
            if (product) {
                console.log('Product found:', product);
                resolve(product);
            } else {
                console.log('Product not found.');
                reject(new Error('المنتج غير موجود. يرجى المحاولة مرة أخرى.'));
            }
        }, 1000);
    });
};