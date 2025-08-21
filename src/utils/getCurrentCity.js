export const getUserCity = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Геолокация не поддерживается");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`
          );
          const data = await res.json();
          if (data.city) {
            resolve(data.city);
          } else {
            reject("Город не найден");
          }
        } catch (err) {
          reject("Ошибка при получении города");
        }
      },
      (error) => {
        reject("Ошибка геолокации: " + error.message);
      }
    );
  });
};
