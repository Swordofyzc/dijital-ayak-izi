/**
 * Dijital Ayak İzi API Servisi
 * XposedOrNot API'sini kullanarak e-posta adreslerinin veri ihlallerini kontrol eder
 */

const API_BASE_URL = 'https://api.xposedornot.com/v1';

export interface BreachDetail {
  breach: string;
  date: string;
  domain: string;
  logo?: string;
  [key: string]: any;
}

export interface BreachData {
  Email: string;
  Breaches?: number;
  Details?: BreachDetail[];
  error?: string;
}

export interface ApiResponse {
  breaches?: any[];
  status?: string;
  Email?: string;
  Breaches?: number;
  Details?: BreachDetail[];
  [key: string]: any;
}

/**
 * E-posta adresinin veri ihlallerini kontrol eder
 * @param email Kontrol edilecek e-posta adresi
 * @returns Breach verisi veya hata
 */
export async function checkEmail(email: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/check-email/${email}`);
    
    if (!response.ok) {
      throw new Error(`API hatası: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('🔍 API Ham Veri:', data);
    
    // API'nin farklı yanıt formatlarını normalize et
    return data;
  } catch (error) {
    console.error('API çağrısı başarısız:', error);
    throw error;
  }
}

/**
 * Test API çağrısı
 */
export async function testAPI(): Promise<ApiResponse> {
  const testEmail = 'test@test.com';
  console.log(`Test API çağrısı yapılıyor: ${testEmail}`);
  
  const result = await checkEmail(testEmail);
  console.log('API Test Sonucu:', result);
  
  return result;
}

