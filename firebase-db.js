/**
 * Firebase Database Manager
 * يدير عمليات قاعدة البيانات مع Firestore و Realtime Database
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot 
} from "firebase/firestore";

import { 
  ref, 
  get, 
  set, 
  update, 
  remove, 
  onValue, 
  push,
  child 
} from "firebase/database";

import { db, realtimeDb } from "./firebase-config.js";

// ========== Firestore Functions ==========

/**
 * الحصول على جميع العملاء من Firestore
 */
export async function getCustomersFirestore() {
  try {
    const customersRef = collection(db, "customers");
    const snapshot = await getDocs(customersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting customers:", error);
    return [];
  }
}

/**
 * حفظ عميل في Firestore
 */
export async function saveCustomerFirestore(customer) {
  try {
    const customerRef = doc(db, "customers", customer.id);
    await setDoc(customerRef, customer);
    return true;
  } catch (error) {
    console.error("Error saving customer:", error);
    return false;
  }
}

/**
 * حذف عميل من Firestore
 */
export async function deleteCustomerFirestore(customerId) {
  try {
    const customerRef = doc(db, "customers", customerId);
    await deleteDoc(customerRef);
    return true;
  } catch (error) {
    console.error("Error deleting customer:", error);
    return false;
  }
}

/**
 * الحصول على جميع المبيعات من Firestore
 */
export async function getSalesFirestore() {
  try {
    const salesRef = collection(db, "sales");
    const q = query(salesRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting sales:", error);
    return [];
  }
}

/**
 * حفظ بيع في Firestore
 */
export async function saveSaleFirestore(sale) {
  try {
    const saleRef = doc(db, "sales", sale.id);
    await setDoc(saleRef, sale);
    return true;
  } catch (error) {
    console.error("Error saving sale:", error);
    return false;
  }
}

/**
 * تحديث بيع في Firestore
 */
export async function updateSaleFirestore(saleId, updates) {
  try {
    const saleRef = doc(db, "sales", saleId);
    await updateDoc(saleRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating sale:", error);
    return false;
  }
}

/**
 * حذف بيع من Firestore
 */
export async function deleteSaleFirestore(saleId) {
  try {
    const saleRef = doc(db, "sales", saleId);
    await deleteDoc(saleRef);
    return true;
  } catch (error) {
    console.error("Error deleting sale:", error);
    return false;
  }
}

/**
 * الحصول على جميع الحركات من Firestore
 */
export async function getActivityFirestore() {
  try {
    const activityRef = collection(db, "activity");
    const q = query(activityRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting activity:", error);
    return [];
  }
}

/**
 * إضافة حركة في Firestore
 */
export async function addActivityFirestore(activity) {
  try {
    const activityRef = doc(collection(db, "activity"));
    await setDoc(activityRef, { ...activity, id: activityRef.id });
    return true;
  } catch (error) {
    console.error("Error adding activity:", error);
    return false;
  }
}

/**
 * الحصول على الإعدادات من Firestore
 */
export async function getSettingsFirestore() {
  try {
    const settingsRef = doc(db, "settings", "app");
    const snapshot = await getDoc(settingsRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting settings:", error);
    return null;
  }
}

/**
 * حفظ الإعدادات في Firestore
 */
export async function saveSettingsFirestore(settings) {
  try {
    const settingsRef = doc(db, "settings", "app");
    await setDoc(settingsRef, settings);
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
}

// ========== Realtime Database Functions ==========

/**
 * الحصول على جميع العملاء من Realtime Database
 */
export async function getCustomersRealtime() {
  try {
    const customersRef = ref(realtimeDb, "customers");
    const snapshot = await get(customersRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key]
      }));
    }
    return [];
  } catch (error) {
    console.error("Error getting customers:", error);
    return [];
  }
}

/**
 * حفظ عميل في Realtime Database
 */
export async function saveCustomerRealtime(customer) {
  try {
    const customerRef = ref(realtimeDb, `customers/${customer.id}`);
    await set(customerRef, customer);
    return true;
  } catch (error) {
    console.error("Error saving customer:", error);
    return false;
  }
}

/**
 * حذف عميل من Realtime Database
 */
export async function deleteCustomerRealtime(customerId) {
  try {
    const customerRef = ref(realtimeDb, `customers/${customerId}`);
    await remove(customerRef);
    return true;
  } catch (error) {
    console.error("Error deleting customer:", error);
    return false;
  }
}

/**
 * الحصول على جميع المبيعات من Realtime Database
 */
export async function getSalesRealtime() {
  try {
    const salesRef = ref(realtimeDb, "sales");
    const snapshot = await get(salesRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key]
      }));
    }
    return [];
  } catch (error) {
    console.error("Error getting sales:", error);
    return [];
  }
}

/**
 * حفظ بيع في Realtime Database
 */
export async function saveSaleRealtime(sale) {
  try {
    const saleRef = ref(realtimeDb, `sales/${sale.id}`);
    await set(saleRef, sale);
    return true;
  } catch (error) {
    console.error("Error saving sale:", error);
    return false;
  }
}

/**
 * تحديث بيع في Realtime Database
 */
export async function updateSaleRealtime(saleId, updates) {
  try {
    const saleRef = ref(realtimeDb, `sales/${saleId}`);
    await update(saleRef, updates);
    return true;
  } catch (error) {
    console.error("Error updating sale:", error);
    return false;
  }
}

/**
 * حذف بيع من Realtime Database
 */
export async function deleteSaleRealtime(saleId) {
  try {
    const saleRef = ref(realtimeDb, `sales/${saleId}`);
    await remove(saleRef);
    return true;
  } catch (error) {
    console.error("Error deleting sale:", error);
    return false;
  }
}

/**
 * الحصول على جميع الحركات من Realtime Database
 */
export async function getActivityRealtime() {
  try {
    const activityRef = ref(realtimeDb, "activity");
    const snapshot = await get(activityRef);
    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key]
      }));
    }
    return [];
  } catch (error) {
    console.error("Error getting activity:", error);
    return [];
  }
}

/**
 * إضافة حركة في Realtime Database
 */
export async function addActivityRealtime(activity) {
  try {
    const activityRef = ref(realtimeDb, "activity");
    const newActivityRef = push(activityRef);
    await set(newActivityRef, { ...activity, id: newActivityRef.key });
    return true;
  } catch (error) {
    console.error("Error adding activity:", error);
    return false;
  }
}

/**
 * الاستماع للتغييرات في الوقت الفعلي (Realtime Database)
 */
export function subscribeToCustomersRealtime(callback) {
  const customersRef = ref(realtimeDb, "customers");
  return onValue(customersRef, (snapshot) => {
    if (snapshot.exists()) {
      const customers = Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key]
      }));
      callback(customers);
    } else {
      callback([]);
    }
  });
}

export function subscribeToSalesRealtime(callback) {
  const salesRef = ref(realtimeDb, "sales");
  return onValue(salesRef, (snapshot) => {
    if (snapshot.exists()) {
      const sales = Object.keys(snapshot.val()).map(key => ({
        id: key,
        ...snapshot.val()[key]
      }));
      callback(sales);
    } else {
      callback([]);
    }
  });
}

// ========== Firestore Real-time Listeners ==========

/**
 * الاستماع للتغييرات في الوقت الفعلي (Firestore)
 */
export function subscribeToCustomersFirestore(callback) {
  const customersRef = collection(db, "customers");
  return onSnapshot(customersRef, (snapshot) => {
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(customers);
  });
}

export function subscribeToSalesFirestore(callback) {
  const salesRef = collection(db, "sales");
  const q = query(salesRef, orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const sales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(sales);
  });
}
