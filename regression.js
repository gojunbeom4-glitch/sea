/**
 * ============================================================================
 * [기상청 여름철 해양 체감온도 대표 선형회귀 모델 모듈]
 * ============================================================================
 * 
 * 대표 선형회귀 방정식:
 * AT = 0.825 × TA - 0.245 × WS + 0.115 × HM + 2.15
 * 
 * 변수 명세:
 * - TA (Air Temperature): 해상 기온 (℃)
 * - WS (Wind Speed): 해상 풍속 (m/s)
 * - HM (Relative Humidity): 상대 습도 (%)
 * - AT (Apparent Temperature): 예측 해상 체감온도 (℃)
 */

/**
 * m/s 단위 풍속을 Knot(노티컬 마일/시간) 단위로 환산
 * @param {number} ms - 초당 미터 풍속 (m/s)
 * @returns {number} Knot 노티컬 마일 환산 풍속
 */
function msToKnot(ms) {
    if (typeof ms !== 'number' || isNaN(ms)) return 0;
    return Math.round((ms * 1.94384) * 10) / 10;
}

/**
 * 선원 온열 위험도 및 위험 등급 산출 함수
 * @param {number} apparentTemp - 체감온도 (℃)
 * @returns {Object} { level: 등급 텍스트, color: 색상 코드, desc: 상세 설명 }
 */
function getHeatRiskGrade(apparentTemp) {
    if (apparentTemp >= 33.0) {
        return {
            level: '🔴 위험 (Extreme Heat Risk)',
            color: '#ef4444',
            desc: '선원 열사병 및 온열 질환 위험 매우 높음! 작업 시간 단축 및 즉시 응급 그늘 피항 필수.'
        };
    } else if (apparentTemp >= 31.0) {
        return {
            level: '🟠 경고 (High Heat Risk)',
            color: '#f59e0b',
            desc: '고체감온도 경보! 야외 갑판 작업 시 충분한 수분 보충 및 30분 단위 휴식 권고.'
        };
    } else if (apparentTemp >= 28.0) {
        return {
            level: '🟡 주의 (Moderate Heat Risk)',
            color: '#eab308',
            desc: '여름철 쾌적 범위를 벗어난 체감온도. 갑판 근무 시 온열 주의 관찰 필요.'
        };
    } else {
        return {
            level: '🟢 쾌적 (Comfortable / Safe)',
            color: '#10b981',
            desc: '해상 운항 및 갑판 작업에 적합한 정상적이고 안전한 해상 체감온도 범위.'
        };
    }
}

/**
 * 기상청 대표 선형회귀 방정식 기반 해상 체감온도 계산 함수
 * @param {number} ta - 해상 기온 (℃)
 * @param {number} ws - 해상 풍속 (m/s)
 * @param {number} hm - 상대 습도 (%)
 * @returns {Object} 체감온도 및 분석 결과 객체
 */
function calculateOceanApparentTemp(ta, ws, hm) {
    const temp = parseFloat(ta) || 0;
    const wind = parseFloat(ws) || 0;
    const humidity = parseFloat(hm) || 0;

    // 대표 선형회귀 방정식 적용
    const at = (0.825 * temp) - (0.245 * wind) + (0.115 * humidity) + 2.15;
    const roundedAT = Math.round(at * 10) / 10;

    const knotWind = msToKnot(wind);
    const riskGrade = getHeatRiskGrade(roundedAT);

    return {
        apparentTemp: roundedAT,
        windSpeedKnot: knotWind,
        riskLevel: riskGrade.level,
        riskColor: riskGrade.color,
        description: riskGrade.desc
    };
}

// 전역 스코프에 함수 등록
window.msToKnot = msToKnot;
window.getHeatRiskGrade = getHeatRiskGrade;
window.calculateOceanApparentTemp = calculateOceanApparentTemp;
