import axios from 'axios';

/**
 * دالة لجلب منتج بواسطة الباركود من API حقيقي
 * @param {string} barcode 
 * @returns {Promise<object>}
 */
export const fetchProductByBarcode = async (barcode) => {
    console.log(`Searching for barcode: ${barcode}`);

    try {
        // استبدل الرابط بالرابط الحقيقي للـ API الخاص بك
        const response = await axios.get(`https://102.213.180.249/back/api/v1/products/barcode/${barcode}`);

        if (response.data) {
            console.log('Product found:', response.data);
            console.log(response.data);
            return response.data;
        } else {
            throw new Error('المنتج غير موجود. يرجى المحاولة مرة أخرى.');
        }
    } catch (error) {
        console.error('Error fetching product:', error.message || error);
        throw new Error(error.response?.data?.message || 'حدث خطأ أثناء جلب المنتج.');
    }
};
