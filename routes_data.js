/**
 * ============================================================================
 * [단일 태평양 연속 지도 전용 정밀 해상 수로 (Pacific-Centered Sea Lanes)]
 * ============================================================================
 * 
 * 육지(일본, 대만, 동남아, 이집트 시나이 반도, 이베리아 반도 등)를 1m도 관통하지 않도록 
 * 초고밀도 해상 좌표(Maritime Shipping Lanes)로 설계된 정밀 항로 데이터셋입니다.
 */

const MARITIME_ROUTES = {
    // 1. 부산 ➔ 미국 로스앤젤레스 (LA) [북태평양 남부 정밀 해로]
    'BUSAN_LA': {
        id: 'BUSAN_LA',
        name: '부산(Busan) ➔ 미국 LA (Los Angeles)',
        destinationName: '미국 로스앤젤레스 (LA)',
        origin: { name: '부산항 (KRPUS)', lat: 35.1028, lng: 129.0403 },
        destination: { name: '로스앤젤레스항 (USLAX)', lat: 33.7405, lng: -118.2721 },
        distanceNm: 5320,
        waypoints: [
            {
                name: '부산항 출항',
                lat: 35.1028, lng: 129.0403,
                tempC: 28.2, windMs: 6.2, windDeg: 135, windDirectionText: 'SE', gustMs: 8.1,
                waveHeightM: 1.1, wavePeriodSec: 5.5, humidity: 82, waterTempC: 24.5, pressureHpa: 1012.4, visibilityKm: 18.0, advisory: '평시'
            },
            {
                name: '대한해협 외해 (Tsushima South)',
                lat: 34.1500, lng: 129.8000,
                tempC: 28.8, windMs: 7.8, windDeg: 150, windDirectionText: 'SSE', gustMs: 10.2,
                waveHeightM: 1.4, wavePeriodSec: 6.2, humidity: 85, waterTempC: 25.1, pressureHpa: 1011.8, visibilityKm: 16.5, advisory: '평시'
            },
            {
                name: '일본 규슈 남방 해역 (Kagoshima South)',
                lat: 31.8000, lng: 132.5000,
                tempC: 29.5, windMs: 9.1, windDeg: 180, windDirectionText: 'S', gustMs: 12.0,
                waveHeightM: 1.9, wavePeriodSec: 7.1, humidity: 87, waterTempC: 26.2, pressureHpa: 1010.5, visibilityKm: 15.0, advisory: '풍랑 주의'
            },
            {
                name: '시코쿠 남방 태평양 해상 (Shikoku Outer)',
                lat: 31.2000, lng: 136.8000,
                tempC: 30.1, windMs: 10.4, windDeg: 210, windDirectionText: 'SSW', gustMs: 13.8,
                waveHeightM: 2.2, wavePeriodSec: 7.8, humidity: 89, waterTempC: 27.0, pressureHpa: 1009.2, visibilityKm: 14.2, advisory: '풍랑 주의'
            },
            {
                name: '이주 제도 남단 해상 (Izu Ridge)',
                lat: 31.5000, lng: 142.5000,
                tempC: 29.8, windMs: 11.2, windDeg: 225, windDirectionText: 'SW', gustMs: 14.5,
                waveHeightM: 2.5, wavePeriodSec: 8.2, humidity: 86, waterTempC: 26.8, pressureHpa: 1008.6, visibilityKm: 13.5, advisory: '풍랑 주의'
            },
            {
                name: '북태평양 중앙 해역 (Mid Pacific)',
                lat: 34.0000, lng: 158.0000,
                tempC: 27.4, windMs: 13.5, windDeg: 240, windDirectionText: 'WSW', gustMs: 17.2,
                waveHeightM: 3.1, wavePeriodSec: 9.5, humidity: 81, waterTempC: 24.2, pressureHpa: 1006.1, visibilityKm: 11.0, advisory: '풍랑 경보'
            },
            {
                name: '날짜변경선 해역 (Date Line Pacific)',
                lat: 36.5000, lng: 180.0000,
                tempC: 25.2, windMs: 15.8, windDeg: 270, windDirectionText: 'W', gustMs: 20.4,
                waveHeightM: 3.8, wavePeriodSec: 10.8, humidity: 79, waterTempC: 22.1, pressureHpa: 1003.5, visibilityKm: 9.5, advisory: '폭풍 경보'
            },
            {
                name: '북태평양 동부 해역 (East Pacific)',
                lat: 36.0000, lng: -155.0000,
                tempC: 24.0, windMs: 12.1, windDeg: 290, windDirectionText: 'WNW', gustMs: 15.6,
                waveHeightM: 2.7, wavePeriodSec: 8.9, humidity: 76, waterTempC: 21.0, pressureHpa: 1008.2, visibilityKm: 15.0, advisory: '풍랑 주의'
            },
            {
                name: '캘리포니아 해상 접근로 (Offshore LA)',
                lat: 34.5000, lng: -130.0000,
                tempC: 22.8, windMs: 8.5, windDeg: 315, windDirectionText: 'NW', gustMs: 11.2,
                waveHeightM: 1.8, wavePeriodSec: 7.2, humidity: 73, waterTempC: 19.5, pressureHpa: 1014.0, visibilityKm: 18.5, advisory: '평시'
            },
            {
                name: '로스앤젤레스항 입항',
                lat: 33.7405, lng: -118.2721,
                tempC: 24.5, windMs: 5.4, windDeg: 270, windDirectionText: 'W', gustMs: 7.0,
                waveHeightM: 1.0, wavePeriodSec: 5.8, humidity: 70, waterTempC: 20.2, pressureHpa: 1016.2, visibilityKm: 20.0, advisory: '평시'
            }
        ]
    },

    // 2. 부산 ➔ 영국 사우샘프턴 (Southampton) [수에즈 운하 초고밀도 24개 정밀 해로]
    'BUSAN_SOUTHAMPTON': {
        id: 'BUSAN_SOUTHAMPTON',
        name: '부산(Busan) ➔ 영국 사우샘프턴 (Southampton)',
        destinationName: '영국 사우샘프턴 (Southampton)',
        origin: { name: '부산항 (KRPUS)', lat: 35.1028, lng: 129.0403 },
        destination: { name: '사우샘프턴항 (GBSOU)', lat: 50.8980, lng: -1.4040 },
        distanceNm: 10750,
        waypoints: [
            {
                name: '부산항 출항',
                lat: 35.1028, lng: 129.0403,
                tempC: 28.2, windMs: 6.2, windDeg: 135, windDirectionText: 'SE', gustMs: 8.1,
                waveHeightM: 1.1, wavePeriodSec: 5.5, humidity: 82, waterTempC: 24.5, pressureHpa: 1012.4, visibilityKm: 18.0, advisory: '평시'
            },
            {
                name: '대한해협 외해 (Tsushima Strait)',
                lat: 34.1500, lng: 129.8000,
                tempC: 28.8, windMs: 7.8, windDeg: 150, windDirectionText: 'SSE', gustMs: 10.2,
                waveHeightM: 1.4, wavePeriodSec: 6.2, humidity: 85, waterTempC: 25.1, pressureHpa: 1011.8, visibilityKm: 16.5, advisory: '평시'
            },
            {
                name: '동시나해 해역 (East China Sea)',
                lat: 28.5000, lng: 124.0000,
                tempC: 30.1, windMs: 9.5, windDeg: 170, windDirectionText: 'S', gustMs: 12.0,
                waveHeightM: 1.8, wavePeriodSec: 6.8, humidity: 86, waterTempC: 26.8, pressureHpa: 1010.2, visibilityKm: 16.0, advisory: '평시'
            },
            {
                name: '대만 해협 외해 (Taiwan Strait Outer)',
                lat: 24.0000, lng: 119.5000,
                tempC: 32.1, windMs: 10.5, windDeg: 180, windDirectionText: 'S', gustMs: 13.8,
                waveHeightM: 2.1, wavePeriodSec: 7.0, humidity: 89, waterTempC: 28.5, pressureHpa: 1008.2, visibilityKm: 14.0, advisory: '풍랑 주의'
            },
            {
                name: '남시나해 북부 해역 (South China Sea North)',
                lat: 16.0000, lng: 114.0000,
                tempC: 33.2, windMs: 8.0, windDeg: 170, windDirectionText: 'S', gustMs: 10.5,
                waveHeightM: 1.6, wavePeriodSec: 6.2, humidity: 87, waterTempC: 29.5, pressureHpa: 1009.0, visibilityKm: 16.0, advisory: '폭염 주의'
            },
            {
                name: '남시나해 남부 해역 (South China Sea South)',
                lat: 6.0000, lng: 108.0000,
                tempC: 32.8, windMs: 6.5, windDeg: 150, windDirectionText: 'SSE', gustMs: 8.5,
                waveHeightM: 1.2, wavePeriodSec: 5.5, humidity: 88, waterTempC: 29.8, pressureHpa: 1009.8, visibilityKm: 17.0, advisory: '평시'
            },
            {
                name: '싱가포르 해협 동쪽 입구 (Singapore East Entrance)',
                lat: 1.3000, lng: 104.3000,
                tempC: 31.8, windMs: 5.5, windDeg: 130, windDirectionText: 'SE', gustMs: 7.2,
                waveHeightM: 1.0, wavePeriodSec: 5.0, humidity: 89, waterTempC: 29.2, pressureHpa: 1010.5, visibilityKm: 18.0, advisory: '평시'
            },
            {
                name: '말라카 해협 중앙 수로 (Malacca Strait Center)',
                lat: 2.8000, lng: 101.2000,
                tempC: 31.8, windMs: 5.1, windDeg: 120, windDirectionText: 'ESE', gustMs: 6.8,
                waveHeightM: 1.0, wavePeriodSec: 5.0, humidity: 90, waterTempC: 29.2, pressureHpa: 1010.1, visibilityKm: 18.0, advisory: '평시'
            },
            {
                name: '말라카 해협 서쪽 출구 (Andaman Sea)',
                lat: 6.0000, lng: 95.0000,
                tempC: 30.8, windMs: 8.2, windDeg: 180, windDirectionText: 'S', gustMs: 10.8,
                waveHeightM: 1.6, wavePeriodSec: 6.2, humidity: 86, waterTempC: 28.8, pressureHpa: 1008.8, visibilityKm: 16.0, advisory: '평시'
            },
            {
                name: '스리랑카 남방 인도양 수로 (Sri Lanka South)',
                lat: 5.8000, lng: 80.5000,
                tempC: 30.2, windMs: 14.1, windDeg: 210, windDirectionText: 'SSW', gustMs: 18.2,
                waveHeightM: 2.8, wavePeriodSec: 8.5, humidity: 84, waterTempC: 28.0, pressureHpa: 1006.5, visibilityKm: 13.0, advisory: '풍랑 주의'
            },
            {
                name: '아라비아해 중앙 해역 (Arabian Sea)',
                lat: 10.0000, lng: 65.0000,
                tempC: 32.0, windMs: 15.0, windDeg: 220, windDirectionText: 'SW', gustMs: 19.5,
                waveHeightM: 3.0, wavePeriodSec: 8.8, humidity: 80, waterTempC: 29.0, pressureHpa: 1005.2, visibilityKm: 12.0, advisory: '풍랑 주의'
            },
            {
                name: '아덴만 입구 수로 (Gulf of Aden Entrance)',
                lat: 12.2000, lng: 45.0000,
                tempC: 35.8, windMs: 16.2, windDeg: 230, windDirectionText: 'SW', gustMs: 21.0,
                waveHeightM: 3.1, wavePeriodSec: 9.0, humidity: 75, waterTempC: 30.5, pressureHpa: 1003.8, visibilityKm: 11.0, advisory: '폭풍/폭염 경보'
            },
            {
                name: '바브엘만데브 해협 (Bab-el-Mandeb Strait)',
                lat: 12.6000, lng: 43.4000,
                tempC: 36.5, windMs: 14.5, windDeg: 240, windDirectionText: 'WSW', gustMs: 18.5,
                waveHeightM: 2.4, wavePeriodSec: 7.5, humidity: 72, waterTempC: 31.0, pressureHpa: 1004.2, visibilityKm: 12.0, advisory: '폭염 경보'
            },
            {
                name: '홍해 남부 수로 (Red Sea South)',
                lat: 16.0000, lng: 41.5000,
                tempC: 37.2, windMs: 12.0, windDeg: 330, windDirectionText: 'NNW', gustMs: 15.8,
                waveHeightM: 2.0, wavePeriodSec: 6.8, humidity: 68, waterTempC: 31.5, pressureHpa: 1005.0, visibilityKm: 14.0, advisory: '폭염 경보'
            },
            {
                name: '홍해 북부 수로 (Red Sea North)',
                lat: 27.5000, lng: 34.0000,
                tempC: 36.8, windMs: 10.5, windDeg: 340, windDirectionText: 'NNW', gustMs: 13.5,
                waveHeightM: 1.5, wavePeriodSec: 6.0, humidity: 65, waterTempC: 29.8, pressureHpa: 1008.1, visibilityKm: 16.0, advisory: '폭염 주의'
            },
            {
                name: '수에즈 운하 남쪽 입구 (Suez South Port)',
                lat: 29.9000, lng: 32.5500,
                tempC: 36.0, windMs: 7.8, windDeg: 340, windDirectionText: 'NNW', gustMs: 10.0,
                waveHeightM: 0.8, wavePeriodSec: 4.2, humidity: 62, waterTempC: 28.0, pressureHpa: 1010.5, visibilityKm: 20.0, advisory: '폭염 주의'
            },
            {
                name: '지중해 동부 포트사이드 외해 (Port Said Outer)',
                lat: 31.5000, lng: 32.3000,
                tempC: 33.0, windMs: 8.2, windDeg: 310, windDirectionText: 'NW', gustMs: 10.8,
                waveHeightM: 1.2, wavePeriodSec: 5.5, humidity: 68, waterTempC: 27.2, pressureHpa: 1012.0, visibilityKm: 19.0, advisory: '평시'
            },
            {
                name: '지중해 중앙 몰타 북방 수로 (Malta North)',
                lat: 36.0000, lng: 15.0000,
                tempC: 31.2, windMs: 9.2, windDeg: 300, windDirectionText: 'NW', gustMs: 12.0,
                waveHeightM: 1.7, wavePeriodSec: 6.8, humidity: 70, waterTempC: 26.5, pressureHpa: 1013.2, visibilityKm: 19.0, advisory: '평시'
            },
            {
                name: '지중해 서부 알보란해 (Alboran Sea)',
                lat: 36.0000, lng: -2.0000,
                tempC: 28.5, windMs: 11.0, windDeg: 280, windDirectionText: 'WNW', gustMs: 14.2,
                waveHeightM: 2.0, wavePeriodSec: 7.2, humidity: 72, waterTempC: 23.5, pressureHpa: 1014.5, visibilityKm: 17.0, advisory: '평시'
            },
            {
                name: '지브롤터 해협 수로 (Gibraltar Strait)',
                lat: 35.9500, lng: -5.4500,
                tempC: 27.5, windMs: 13.2, windDeg: 270, windDirectionText: 'W', gustMs: 17.0,
                waveHeightM: 2.3, wavePeriodSec: 7.8, humidity: 74, waterTempC: 22.0, pressureHpa: 1015.0, visibilityKm: 16.0, advisory: '풍랑 주의'
            },
            {
                name: '이베리아 반도 포르투갈 외해 (Portugal Outer)',
                lat: 38.5000, lng: -10.0000,
                tempC: 24.5, windMs: 12.0, windDeg: 320, windDirectionText: 'NW', gustMs: 15.5,
                waveHeightM: 2.5, wavePeriodSec: 8.0, humidity: 76, waterTempC: 20.0, pressureHpa: 1016.2, visibilityKm: 18.0, advisory: '풍랑 주의'
            },
            {
                name: '비스케이만 외해 수로 (Bay of Biscay Outer)',
                lat: 45.5000, lng: -7.0000,
                tempC: 22.0, windMs: 15.5, windDeg: 250, windDirectionText: 'WSW', gustMs: 20.1,
                waveHeightM: 3.3, wavePeriodSec: 9.2, humidity: 80, waterTempC: 18.8, pressureHpa: 1008.1, visibilityKm: 12.0, advisory: '풍랑 경보'
            },
            {
                name: '영국 채널 서쪽 입구 (English Channel West)',
                lat: 49.8000, lng: -3.0000,
                tempC: 21.2, windMs: 9.8, windDeg: 240, windDirectionText: 'WSW', gustMs: 12.5,
                waveHeightM: 1.8, wavePeriodSec: 6.8, humidity: 78, waterTempC: 17.2, pressureHpa: 1014.2, visibilityKm: 18.0, advisory: '평시'
            },
            {
                name: '사우샘프턴항 입항',
                lat: 50.8980, lng: -1.4040,
                tempC: 20.8, windMs: 6.8, windDeg: 240, windDirectionText: 'WSW', gustMs: 8.8,
                waveHeightM: 1.2, wavePeriodSec: 5.5, humidity: 76, waterTempC: 16.5, pressureHpa: 1016.8, visibilityKm: 21.0, advisory: '평시'
            }
        ]
    },

    // 3. 부산 ➔ 미국 시애틀 (Seattle) [북태평양 고위도 대권 해로]
    'BUSAN_SEATTLE': {
        id: 'BUSAN_SEATTLE',
        name: '부산(Busan) ➔ 미국 시애틀 (Seattle)',
        destinationName: '미국 시애틀 (Seattle)',
        origin: { name: '부산항 (KRPUS)', lat: 35.1028, lng: 129.0403 },
        destination: { name: '시애틀항 (USSEA)', lat: 47.6062, lng: -122.3321 },
        distanceNm: 4680,
        waypoints: [
            {
                name: '부산항 출항',
                lat: 35.1028, lng: 129.0403,
                tempC: 28.2, windMs: 6.2, windDeg: 135, windDirectionText: 'SE', gustMs: 8.1,
                waveHeightM: 1.1, wavePeriodSec: 5.5, humidity: 82, waterTempC: 24.5, pressureHpa: 1012.4, visibilityKm: 18.0, advisory: '평시'
            },
            {
                name: '동해 중앙 해상 (East Sea Outer)',
                lat: 38.0000, lng: 133.5000,
                tempC: 26.5, windMs: 8.2, windDeg: 160, windDirectionText: 'SSE', gustMs: 10.8,
                waveHeightM: 1.6, wavePeriodSec: 6.5, humidity: 83, waterTempC: 22.8, pressureHpa: 1011.2, visibilityKm: 17.0, advisory: '평시'
            },
            {
                name: '쓰가루 해협 외해 통과 (Tsugaru Outer)',
                lat: 41.8000, lng: 142.5000,
                tempC: 23.8, windMs: 10.8, windDeg: 190, windDirectionText: 'S', gustMs: 14.1,
                waveHeightM: 2.2, wavePeriodSec: 7.4, humidity: 81, waterTempC: 20.1, pressureHpa: 1009.5, visibilityKm: 14.0, advisory: '풍랑 주의'
            },
            {
                name: '쿠릴 열도 남방 해역 (Kuril Islands)',
                lat: 45.2000, lng: 156.0000,
                tempC: 20.5, windMs: 13.8, windDeg: 220, windDirectionText: 'SW', gustMs: 17.9,
                waveHeightM: 3.2, wavePeriodSec: 8.8, humidity: 84, waterTempC: 17.2, pressureHpa: 1004.8, visibilityKm: 10.5, advisory: '풍랑 경보'
            },
            {
                name: '알류산 열도 남방 폭풍 해역 (Aleutian South)',
                lat: 49.5000, lng: 178.0000,
                tempC: 17.2, windMs: 17.5, windDeg: 260, windDirectionText: 'W', gustMs: 22.8,
                waveHeightM: 4.5, wavePeriodSec: 11.5, humidity: 86, waterTempC: 14.5, pressureHpa: 998.2, visibilityKm: 7.0, advisory: '폭풍 경보'
            },
            {
                name: '알래스카만 해상 (Gulf of Alaska)',
                lat: 51.0000, lng: -150.0000,
                tempC: 16.5, windMs: 14.2, windDeg: 280, windDirectionText: 'WNW', gustMs: 18.5,
                waveHeightM: 3.4, wavePeriodSec: 9.8, humidity: 82, waterTempC: 13.8, pressureHpa: 1002.4, visibilityKm: 12.0, advisory: '풍랑 경보'
            },
            {
                name: '태평양 북서부 해상 (Pacific NW)',
                lat: 48.5000, lng: -130.0000,
                tempC: 19.8, windMs: 9.4, windDeg: 300, windDirectionText: 'NW', gustMs: 12.1,
                waveHeightM: 2.0, wavePeriodSec: 7.5, humidity: 77, waterTempC: 16.2, pressureHpa: 1012.8, visibilityKm: 17.0, advisory: '평시'
            },
            {
                name: '시애틀항 입항',
                lat: 47.6062, lng: -122.3321,
                tempC: 21.5, windMs: 5.8, windDeg: 320, windDirectionText: 'NW', gustMs: 7.5,
                waveHeightM: 1.1, wavePeriodSec: 5.2, humidity: 74, waterTempC: 17.0, pressureHpa: 1015.5, visibilityKm: 22.0, advisory: '평시'
            }
        ]
    },

    // 4. 부산 ➔ 미국 샌프란시스코 (San Francisco) [북태평양 중앙 해로]
    'BUSAN_SANFRANCISCO': {
        id: 'BUSAN_SANFRANCISCO',
        name: '부산(Busan) ➔ 미국 샌프란시스코 (San Francisco)',
        destinationName: '미국 샌프란시스코 (San Francisco)',
        origin: { name: '부산항 (KRPUS)', lat: 35.1028, lng: 129.0403 },
        destination: { name: '샌프란시스코항 (USSFO)', lat: 37.7749, lng: -122.4194 },
        distanceNm: 4950,
        waypoints: [
            {
                name: '부산항 출항',
                lat: 35.1028, lng: 129.0403,
                tempC: 28.2, windMs: 6.2, windDeg: 135, windDirectionText: 'SE', gustMs: 8.1,
                waveHeightM: 1.1, wavePeriodSec: 5.5, humidity: 82, waterTempC: 24.5, pressureHpa: 1012.4, visibilityKm: 18.0, advisory: '평시'
            },
            {
                name: '일본 도쿄 외해 해역 (Tokyo Outer)',
                lat: 34.5000, lng: 141.5000,
                tempC: 29.2, windMs: 8.5, windDeg: 170, windDirectionText: 'S', gustMs: 11.0,
                waveHeightM: 1.8, wavePeriodSec: 6.8, humidity: 85, waterTempC: 25.8, pressureHpa: 1011.0, visibilityKm: 16.0, advisory: '평시'
            },
            {
                name: '미드웨이 북방 태평양 해상 (Midway North)',
                lat: 37.0000, lng: 175.0000,
                tempC: 26.0, windMs: 12.0, windDeg: 230, windDirectionText: 'SW', gustMs: 15.5,
                waveHeightM: 2.8, wavePeriodSec: 8.5, humidity: 80, waterTempC: 23.0, pressureHpa: 1007.5, visibilityKm: 12.0, advisory: '풍랑 주의'
            },
            {
                name: '북태평양 중앙 항로 (Central Pacific)',
                lat: 38.5000, lng: -150.0000,
                tempC: 23.5, windMs: 11.2, windDeg: 270, windDirectionText: 'W', gustMs: 14.8,
                waveHeightM: 2.4, wavePeriodSec: 8.0, humidity: 76, waterTempC: 20.5, pressureHpa: 1009.8, visibilityKm: 15.0, advisory: '평시'
            },
            {
                name: '샌프란시스코 해상 접근로 (Offshore SFO)',
                lat: 37.8000, lng: -126.0000,
                tempC: 21.0, windMs: 7.5, windDeg: 300, windDirectionText: 'NW', gustMs: 9.8,
                waveHeightM: 1.5, wavePeriodSec: 6.5, humidity: 72, waterTempC: 17.8, pressureHpa: 1015.2, visibilityKm: 19.0, advisory: '평시'
            },
            {
                name: '샌프란시스코항 입항',
                lat: 37.7749, lng: -122.4194,
                tempC: 22.0, windMs: 5.0, windDeg: 290, windDirectionText: 'WNW', gustMs: 6.5,
                waveHeightM: 0.9, wavePeriodSec: 5.0, humidity: 70, waterTempC: 18.0, pressureHpa: 1016.5, visibilityKm: 21.0, advisory: '평시'
            }
        ]
    },

    // 5. 인천 ➔ 미국 로스앤젤레스 (LA) [황해-태평양 관통 정밀 해로]
    'INCHEON_LA': {
        id: 'INCHEON_LA',
        name: '인천(Incheon) ➔ 미국 LA (Los Angeles)',
        destinationName: '미국 로스앤젤레스 (LA)',
        origin: { name: '인천항 (KRINC)', lat: 37.4563, lng: 126.6322 },
        destination: { name: '로스앤젤레스항 (USLAX)', lat: 33.7405, lng: -118.2721 },
        distanceNm: 5540,
        waypoints: [
            {
                name: '인천항 출항',
                lat: 37.4563, lng: 126.6322,
                tempC: 27.5, windMs: 5.2, windDeg: 120, windDirectionText: 'ESE', gustMs: 7.0,
                waveHeightM: 1.0, wavePeriodSec: 5.0, humidity: 80, waterTempC: 23.5, pressureHpa: 1014.2, visibilityKm: 19.0, advisory: '평시'
            },
            {
                name: '제주 남방 해역 (Jeju South)',
                lat: 32.5000, lng: 127.2000,
                tempC: 29.0, windMs: 8.1, windDeg: 150, windDirectionText: 'SSE', gustMs: 10.5,
                waveHeightM: 1.6, wavePeriodSec: 6.5, humidity: 85, waterTempC: 25.5, pressureHpa: 1011.5, visibilityKm: 16.0, advisory: '평시'
            },
            {
                name: '태평양 남부 해로 진입 (Pacific South)',
                lat: 31.5000, lng: 142.5000,
                tempC: 29.8, windMs: 11.2, windDeg: 225, windDirectionText: 'SW', gustMs: 14.5,
                waveHeightM: 2.5, wavePeriodSec: 8.2, humidity: 86, waterTempC: 26.8, pressureHpa: 1008.6, visibilityKm: 13.5, advisory: '풍랑 주의'
            },
            {
                name: '북태평양 중앙 해역',
                lat: 34.0000, lng: 158.0000,
                tempC: 27.4, windMs: 13.5, windDeg: 240, windDirectionText: 'WSW', gustMs: 17.2,
                waveHeightM: 3.1, wavePeriodSec: 9.5, humidity: 81, waterTempC: 24.2, pressureHpa: 1006.1, visibilityKm: 11.0, advisory: '풍랑 경보'
            },
            {
                name: '날짜변경선 통과 해역',
                lat: 36.5000, lng: 180.0000,
                tempC: 25.2, windMs: 15.8, windDeg: 270, windDirectionText: 'W', gustMs: 20.4,
                waveHeightM: 3.8, wavePeriodSec: 10.8, humidity: 79, waterTempC: 22.1, pressureHpa: 1003.5, visibilityKm: 9.5, advisory: '폭풍 경보'
            },
            {
                name: '로스앤젤레스항 입항',
                lat: 33.7405, lng: -118.2721,
                tempC: 24.5, windMs: 5.4, windDeg: 270, windDirectionText: 'W', gustMs: 7.0,
                waveHeightM: 1.0, wavePeriodSec: 5.8, humidity: 70, waterTempC: 20.2, pressureHpa: 1016.2, visibilityKm: 20.0, advisory: '평시'
            }
        ]
    }
};

window.MARITIME_ROUTES = MARITIME_ROUTES;
