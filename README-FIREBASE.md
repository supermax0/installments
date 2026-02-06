# إعداد Firebase للمشروع

## الملفات المضافة

1. **firebase-init.js** - ملف إدارة قاعدة البيانات
2. **firebase-config.js** - ملف التكوين (للاستخدام مع ES modules)
3. **firebase-db.js** - دوال قاعدة البيانات (للاستخدام مع ES modules)

## الإعدادات المطلوبة

### 1. Firestore Database
- اذهب إلى [Firebase Console](https://console.firebase.google.com/)
- اختر المشروع `installments-e4139`
- اذهب إلى **Firestore Database**
- اضغط **Create database**
- اختر **Start in test mode** (للاختبار) أو قم بإعداد قواعد الأمان

### 2. Realtime Database
- اذهب إلى **Realtime Database**
- اضغط **Create database**
- اختر الموقع الأقرب
- اختر **Start in test mode** (للاختبار)

## قواعد الأمان (Security Rules)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**ملاحظة:** القواعد أعلاه للاختبار فقط. يجب تحديثها للإنتاج.

## الاستخدام

### في app.js
يمكنك استخدام Firebase بدلاً من LocalStorage:

```javascript
// بدلاً من localStorage
const customers = getCustomers();

// استخدم Firebase
const customers = await window.firebaseDB.getCustomersFirestore();
// أو
const customers = await window.firebaseDB.getCustomersRealtime();
```

### التهيئة
```javascript
// في بداية app.js
window.firebaseDB.init();
```

## الميزات المتاحة

### Firestore
- `getCustomersFirestore()` - الحصول على العملاء
- `saveCustomerFirestore(customer)` - حفظ عميل
- `deleteCustomerFirestore(id)` - حذف عميل
- `getSalesFirestore()` - الحصول على المبيعات
- `saveSaleFirestore(sale)` - حفظ بيع
- `updateSaleFirestore(id, updates)` - تحديث بيع
- `deleteSaleFirestore(id)` - حذف بيع
- `getActivityFirestore()` - الحصول على الحركات
- `addActivityFirestore(activity)` - إضافة حركة
- `getSettingsFirestore()` - الحصول على الإعدادات
- `saveSettingsFirestore(settings)` - حفظ الإعدادات
- `subscribeToCustomersFirestore(callback)` - الاستماع للتغييرات
- `subscribeToSalesFirestore(callback)` - الاستماع للتغييرات

### Realtime Database
- `getCustomersRealtime()` - الحصول على العملاء
- `saveCustomerRealtime(customer)` - حفظ عميل
- `deleteCustomerRealtime(id)` - حذف عميل
- `getSalesRealtime()` - الحصول على المبيعات
- `saveSaleRealtime(sale)` - حفظ بيع
- `updateSaleRealtime(id, updates)` - تحديث بيع
- `deleteSaleRealtime(id)` - حذف بيع
- `getActivityRealtime()` - الحصول على الحركات
- `addActivityRealtime(activity)` - إضافة حركة
- `subscribeToCustomersRealtime(callback)` - الاستماع للتغييرات
- `subscribeToSalesRealtime(callback)` - الاستماع للتغييرات

## مثال على الاستخدام

```javascript
// تهيئة Firebase
window.firebaseDB.init();

// الانتظار حتى يكون Firebase جاهزاً
setTimeout(async () => {
  if (window.firebaseDB.ready()) {
    // الحصول على العملاء
    const customers = await window.firebaseDB.getCustomersFirestore();
    console.log('Customers:', customers);
    
    // حفظ عميل جديد
    const newCustomer = {
      id: 'c' + Date.now(),
      name: 'أحمد',
      phone: '07701234567',
      address: 'بغداد'
    };
    await window.firebaseDB.saveCustomerFirestore(newCustomer);
    
    // الاستماع للتغييرات في الوقت الفعلي
    window.firebaseDB.subscribeToSalesFirestore((sales) => {
      console.log('Sales updated:', sales);
      // تحديث الواجهة
    });
  }
}, 1000);
```

## الترحيل من LocalStorage إلى Firebase

يمكنك إنشاء دالة لترحيل البيانات:

```javascript
async function migrateToFirebase() {
  // الحصول على البيانات من LocalStorage
  const customers = JSON.parse(localStorage.getItem('installments_customers') || '[]');
  const sales = JSON.parse(localStorage.getItem('installments_sales') || '[]');
  const activity = JSON.parse(localStorage.getItem('installments_activity') || '[]');
  
  // حفظها في Firebase
  for (const customer of customers) {
    await window.firebaseDB.saveCustomerFirestore(customer);
  }
  
  for (const sale of sales) {
    await window.firebaseDB.saveSaleFirestore(sale);
  }
  
  for (const act of activity) {
    await window.firebaseDB.addActivityFirestore(act);
  }
  
  console.log('Migration completed!');
}
```
