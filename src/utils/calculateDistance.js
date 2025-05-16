function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = angle => (angle * Math.PI) / 180;
  
    const R = 6371; // Earth's radius in kilometers
  
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c; // Distance in kilometers
  
    return distance;
  }
  
export default haversineDistance
  

// https://maps.googleapis.com/maps/api/distancematrix/json
//   ?destinations=New%20York%20City%2C%20NY
//   &origins=Washington%2C%20DC%7CBoston
//   &units=imperial
//   &key=YOUR_API_KEY

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
  
 export function vincentyDistance(lat1, lon1, lat2, lon2) {
    const a = 6378137; // WGS-84 major axis
    const f = 1 / 298.257223563; // WGS-84 flattening factor
    const b = 6356752.314245; // Semi-minor axis
  
    const L = toRadians(lon2 - lon1);
    const U1 = Math.atan((1 - f) * Math.tan(toRadians(lat1)));
    const U2 = Math.atan((1 - f) * Math.tan(toRadians(lat2)));
    const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
  
    let lambda = L, lambdaP, iterLimit = 100;
    let cosSqAlpha, sinSigma, cos2SigmaM, cosSigma, sigma, sinLambda, cosLambda;
  
    do {
      sinLambda = Math.sin(lambda);
      cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) +
        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
      if (sinSigma == 0) return 0; // co-incident points
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      const sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cosSqAlpha = 1 - sinAlpha * sinAlpha;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
      const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      lambdaP = lambda;
      lambda = L + (1 - C) * f * sinAlpha *
        (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
  
    if (iterLimit == 0) return NaN; // formula failed to converge
  
    const uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
      B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
  
    const distance = b * A * (sigma - deltaSigma);
  
    return distance / 1000; // Return distance in kilometers
  }

  export async function getDrivingDistanceOSRM() {
    const origin = '77.2295,28.6129'; // Delhi
    const destination = '85.1376,25.5941'; // Patna
    
    const url = `http://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=false`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.routes && data.routes.length > 0) {
        const distance = (data.routes[0].distance / 1000).toFixed(2); // Distance in kilometers
        // console.log(`Driving Distance: ${distance} km`);
      } else {
        console.error('No routes found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  

  
  
  // Example usage with the same coordinates (Delhi to Patna):
  const lat1 = 28.6129; // Delhi (India Gate)
  const lon1 = 77.2295; // Delhi (India Gate)
  const lat2 = 25.5941; // Patna (Bihar)
  const lon2 = 85.1376; // Patna (Bihar)
  
  
  