import { useState, useCallback } from 'react';

interface LocationData {
  country: string;
  state: string;
  city: string;
  pinCode: string;
  address: string;
}

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReverseGeocoding = async (lat: number, lon: number): Promise<LocationData | null> => {
    try {
      // Using OpenStreetMap Nominatim (Free, no key required for low volume)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'NanoSchool-Frontend/1.0'
          }
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const addr = data.address || {};

      return {
        country: addr.country || '',
        state: addr.state || addr.region || addr.province || '',
        city: addr.city || addr.town || addr.village || addr.suburb || '',
        pinCode: addr.postcode || '',
        address: [addr.road, addr.neighbourhood, addr.suburb].filter(Boolean).join(', ')
      };
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      return null;
    }
  };

  const getIpBasedLocation = async (): Promise<LocationData | null> => {
    try {
      // Using ipapi.co (Free tier available)
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) return null;

      const data = await response.json();
      return {
        country: data.country_name || '',
        state: data.region || '',
        city: data.city || '',
        pinCode: data.postal || '',
        address: '' // IP based doesn't give street level
      };
    } catch (err) {
      console.error('IP-based location failed:', err);
      return null;
    }
  };

  const detectLocation = useCallback(async (): Promise<LocationData | null> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        getIpBasedLocation().then((data) => {
          setLoading(false);
          resolve(data);
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await getReverseGeocoding(latitude, longitude);
          
          if (!data) {
            // Fallback to IP if reverse geocoding fails
            const ipData = await getIpBasedLocation();
            setLoading(false);
            resolve(ipData);
          } else {
            setLoading(false);
            resolve(data);
          }
        },
        async (err) => {
          console.warn('Geolocation permission denied or failed, falling back to IP:', err.message);
          const ipData = await getIpBasedLocation();
          setLoading(false);
          resolve(ipData);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }, []);

  return { detectLocation, loading, error };
}
