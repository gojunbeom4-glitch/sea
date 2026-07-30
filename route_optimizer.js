/**
 * ============================================================================
 * [다중 목적지 AI 최적 항로 추천 및 우회 피항 알고리즘 모듈]
 * ============================================================================
 * 
 * 해상 체감온도(AT), 유의파고(WV_HT), 풍속(WS), 기상 특보를 종합 분석하여
 * 다중 목적지 중 가장 안전한 최적 항로 추천 순위를 산출합니다.
 */

class RouteOptimizer {
    constructor() {
        this.detourFactor = 0.08;
    }

    /**
     * 항로 피항 경로 산출
     */
    optimizeRoute(route, weatherSeverity = 1.0) {
        if (!route || !route.waypoints) return null;

        let totalOriginalDist = route.distanceNm;
        let detouredCount = 0;

        const optimizedWaypoints = route.waypoints.map((wp, idx) => {
            const simTemp = Math.round((wp.tempC + (weatherSeverity - 1) * 3) * 10) / 10;
            const simWind = Math.round((wp.windMs * weatherSeverity) * 10) / 10;
            const simWave = Math.round((wp.waveHeightM * weatherSeverity) * 10) / 10;

            const atResult = window.calculateOceanApparentTemp(simTemp, simWind, wp.humidity);

            let latOffset = 0;
            let lngOffset = 0;
            let isDetoured = false;
            let detourReason = '';

            // 피항 조건: 체감온도 31℃ 이상, 풍속 14m/s 이상, 파고 3.2m 이상
            if (atResult.apparentTemp >= 31.0) {
                latOffset = -1.2;
                lngOffset = 0.8;
                isDetoured = true;
                detourReason = '고체감온도 회피 남하 피항';
            } else if (simWave >= 3.2 || simWind >= 14.0) {
                latOffset = -2.0;
                lngOffset = 1.2;
                isDetoured = true;
                detourReason = '폭풍우/고파도 우회 피항';
            }

            if (isDetoured) detouredCount++;

            return {
                ...wp,
                tempC: simTemp,
                windMs: simWind,
                windKnot: window.msToKnot(simWind),
                waveHeightM: simWave,
                apparentTemp: atResult.apparentTemp,
                riskLevel: atResult.riskLevel,
                riskColor: atResult.riskColor,
                lat: wp.lat + latOffset,
                lng: wp.lng + lngOffset,
                isDetoured: isDetoured,
                detourReason: detourReason
            };
        });

        const extraDist = Math.round(detouredCount * 45 * weatherSeverity);
        const optimizedDistanceNm = totalOriginalDist + extraDist;

        // 항로 종합 안전 점수 (100점 만점)
        let safetyScore = 100 - Math.round(detouredCount * 12 * weatherSeverity);
        safetyScore = Math.max(40, Math.min(100, safetyScore));

        return {
            routeId: route.id,
            routeName: route.name,
            originalDistanceNm: totalOriginalDist,
            optimizedDistanceNm: optimizedDistanceNm,
            detouredCount: detouredCount,
            safetyScore: safetyScore,
            fuelSaveInfo: detouredCount > 0 ? `우회 거리 +${extraDist} NM (선원 안전 최우선 피항)` : '최단 직항 안전 운항 가능',
            waypoints: optimizedWaypoints
        };
    }

    /**
     * 다중 목적지 항로 중 최적 안전 항로 AI 추천 순위 평가
     */
    recommendSafestRoute(routesMap, weatherSeverity = 1.0) {
        const routeKeys = Object.keys(routesMap);
        const results = [];

        routeKeys.forEach(key => {
            const route = routesMap[key];
            const opt = this.optimizeRoute(route, weatherSeverity);

            const avgAT = Math.round((opt.waypoints.reduce((sum, wp) => sum + wp.apparentTemp, 0) / opt.waypoints.length) * 10) / 10;
            const maxWind = Math.max(...opt.waypoints.map(wp => wp.windMs));
            const maxWave = Math.max(...opt.waypoints.map(wp => wp.waveHeightM));

            results.push({
                routeId: route.id,
                routeName: route.name,
                destinationName: route.destinationName,
                safetyScore: opt.safetyScore,
                avgApparentTemp: avgAT,
                maxWindMs: maxWind,
                maxWaveM: maxWave,
                detouredCount: opt.detouredCount,
                optResult: opt
            });
        });

        // 안전 점수 내림차순 정렬
        results.sort((a, b) => b.safetyScore - a.safetyScore);

        // 뱃지 부여
        results.forEach((item, index) => {
            if (index === 0) item.rankBadge = '🥇 AI 추천 1위 (최고 안전)';
            else if (index === 1) item.rankBadge = '🥈 AI 추천 2위';
            else if (index === 2) item.rankBadge = '🥉 AI 추천 3위';
            else item.rankBadge = `${index + 1}위`;

            item.recommendReason = item.safetyScore >= 85 ? '전 해역 기상 양호, 선원 체감온도 쾌적 범위 유지' : '일부 해역 고파도/강풍 존재하여 피항 우회 권고';
        });

        return results;
    }
}

window.RouteOptimizer = RouteOptimizer;
