/**
 * ============================================================================
 * [메인 애플리케이션 관제 통합 컨트롤러 - 동일 루트 디렉토리 모듈 연동]
 * ============================================================================
 * 
 * 1. 🌀 태풍(풍속), 🌊 파도(유의파고), 🌧️ 비(강수/습도), ⚡ 낙뢰(뇌우위험도), ☀️ 체감온도 동적 업데이트
 * 2. 🛰️ 실사 위성사진 지도 스위칭 및 단 1개 무제한 연속 세계지도 관제
 */

document.addEventListener('DOMContentLoaded', () => {
    const optimizer = new window.RouteOptimizer();
    const weatherService = new window.OceanWeatherApiService();

    // 무제한 연속 경계 범위 (-85~85°N, -540~1080°E : 미국 및 전세계 타일 짤림 원천 방지)
    const southWest = L.latLng(-85, -540);
    const northEast = L.latLng(85, 1080);
    const maxWorldBounds = L.latLngBounds(southWest, northEast);

    // 지형 타일 레이어
    const darkTile = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
        noWrap: false
    });

    // Esri 고해상도 실사 위성사진 타일
    const satelliteTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri World Imagery',
        maxZoom: 18,
        noWrap: false
    });

    // Esri 해양 수심 지형 타일
    const oceanTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri Ocean Basemap',
        maxZoom: 13,
        noWrap: false
    });

    // 태평양 중심 연속 세계지도 생성
    const map = L.map('map', {
        center: [28.0, 175.0],
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        maxBounds: maxWorldBounds,
        maxBoundsViscosity: 0.5,
        worldCopyJump: true,
        layers: [darkTile]
    });

    let currentTileLayer = darkTile;

    setTimeout(() => {
        map.invalidateSize();
    }, 200);

    window.addEventListener('resize', () => {
        map.invalidateSize();
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const climateVisualizer = new window.GlobalOceanClimateVisualizer(map);

    // 레이어 그룹
    const originalRouteLayer = L.layerGroup().addTo(map);
    const optimizedRouteLayer = L.layerGroup().addTo(map);
    const markerLayer = L.layerGroup().addTo(map);
    const buoyLayer = L.layerGroup().addTo(map);
    const vesselAnimationLayer = L.layerGroup().addTo(map);

    // UI 참조
    const routeSelect = document.getElementById('routeSelect');
    const weatherSlider = document.getElementById('weatherSlider');
    const weatherSliderVal = document.getElementById('weatherSliderVal');
    const btnSimulate = document.getElementById('btnSimulate');
    const btnRecommendSafest = document.getElementById('btnRecommendSafest');
    const chkShowBuoy = document.getElementById('chkShowBuoy');

    // 상단 4대 위험 기상 위젯 바 참조
    const widgetWind = document.getElementById('widgetWind');
    const widgetWave = document.getElementById('widgetWave');
    const widgetRain = document.getElementById('widgetRain');
    const widgetLightning = document.getElementById('widgetLightning');
    const widgetAT = document.getElementById('widgetAT');

    // 타일 스위처 버튼
    const btnTileDark = document.getElementById('btnTileDark');
    const btnTileSat = document.getElementById('btnTileSat');
    const btnTileOcean = document.getElementById('btnTileOcean');

    // 오버레이 토글
    const btnToggleClimate = document.getElementById('btnToggleClimate');
    const btnToggleHazard = document.getElementById('btnToggleHazard');

    // 체감온도 계산기
    const calcTemp = document.getElementById('calcTemp');
    const calcWind = document.getElementById('calcWind');
    const calcHumidity = document.getElementById('calcHumidity');
    const btnCalculateAT = document.getElementById('btnCalculateAT');
    const resultAT = document.getElementById('resultAT');
    const resultRisk = document.getElementById('resultRisk');
    const resultDesc = document.getElementById('resultDesc');

    // 요약 패널
    const summaryRouteName = document.getElementById('summaryRouteName');
    const summaryOrigDist = document.getElementById('summaryOrigDist');
    const summaryOptDist = document.getElementById('summaryOptDist');
    const summarySafetyScore = document.getElementById('summarySafetyScore');
    const summaryFuelSave = document.getElementById('summaryFuelSave');
    const recommendationContainer = document.getElementById('recommendationContainer');

    let vesselAnimInterval = null;

    /**
     * 상단 4대 위험 기상 위젯 동적 업데이트 (태풍, 파도, 비, 낙뢰, 체감온도)
     */
    function updateTopWeatherWidget(waypoints) {
        if (!waypoints || waypoints.length === 0) return;

        const avgTemp = Math.round((waypoints.reduce((sum, wp) => sum + wp.tempC, 0) / waypoints.length) * 10) / 10;
        const avgWind = Math.round((waypoints.reduce((sum, wp) => sum + wp.windMs, 0) / waypoints.length) * 10) / 10;
        const avgWave = Math.round((waypoints.reduce((sum, wp) => sum + wp.waveHeightM, 0) / waypoints.length) * 10) / 10;
        const avgHumidity = Math.round(waypoints.reduce((sum, wp) => sum + wp.humidity, 0) / waypoints.length);

        const windKnot = window.msToKnot(avgWind);
        const atData = window.calculateOceanApparentTemp(avgTemp, avgWind, avgHumidity);
        const condInfo = weatherService.getWeatherCondition(avgWind, avgWave, avgTemp);

        if (widgetWind) widgetWind.textContent = `${avgWind}m/s(${windKnot}kt)`;
        if (widgetWave) widgetWave.textContent = `${avgWave}m`;
        if (widgetRain) widgetRain.textContent = `${avgHumidity}%`;
        if (widgetLightning) widgetLightning.textContent = condInfo.lightningRisk;
        if (widgetAT) {
            widgetAT.textContent = `${atData.apparentTemp}℃`;
            widgetAT.style.color = atData.riskColor;
        }
    }

    function normalizePacificLatLngs(waypoints) {
        const normalized = [];
        let prevLng = null;

        waypoints.forEach(wp => {
            let lng = wp.lng;
            if (prevLng !== null) {
                if (prevLng > 100 && lng < 0) {
                    lng = lng + 360;
                }
            }
            prevLng = lng;
            normalized.push({
                ...wp,
                lat: wp.lat,
                lng: lng,
                rawLng: wp.lng
            });
        });

        return normalized;
    }

    function animateVesselAlongRoute(waypoints) {
        if (vesselAnimInterval) clearInterval(vesselAnimInterval);
        vesselAnimationLayer.clearLayers();

        if (!waypoints || waypoints.length < 2) return;

        const normWaypoints = normalizePacificLatLngs(waypoints);
        let currentWpIndex = 0;
        let progress = 0;

        const vesselIcon = L.divIcon({
            className: 'custom-vessel-anim',
            html: `<div class="vessel-animated-icon" style="width:28px; height:28px; font-size:14px;"><i class="fa-solid fa-ship"></i></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const startPt = normWaypoints[0];
        const vesselMarker = L.marker([startPt.lat, startPt.lng], { icon: vesselIcon }).addTo(vesselAnimationLayer);

        vesselAnimInterval = setInterval(() => {
            progress += 0.018;

            if (progress >= 1.0) {
                progress = 0;
                currentWpIndex++;
                if (currentWpIndex >= normWaypoints.length - 1) {
                    currentWpIndex = 0;
                }
            }

            const p1 = normWaypoints[currentWpIndex];
            const p2 = normWaypoints[currentWpIndex + 1];

            const currentLat = p1.lat + (p2.lat - p1.lat) * progress;
            const currentLng = p1.lng + (p2.lng - p1.lng) * progress;

            vesselMarker.setLatLng([currentLat, currentLng]);
        }, 50);
    }

    function renderOceanBuoyMarkers() {
        buoyLayer.clearLayers();
        if (chkShowBuoy && !chkShowBuoy.checked) return;

        const severity = parseFloat(weatherSlider.value);
        const buoys = weatherService.getBuoyStations(severity);

        buoys.forEach(stn => {
            const buoyIcon = L.divIcon({
                className: 'custom-buoy-icon',
                html: `<div style="background: rgba(0, 240, 255, 0.25); border: 2px solid #00f0ff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: #00f0ff; font-size: 11px; box-shadow: 0 0 10px #00f0ff;"><i class="fa-solid fa-anchor"></i></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([stn.lat, stn.lng], { icon: buoyIcon }).addTo(buoyLayer);

            const popupContent = `
                <div class="weather-popup-card">
                    <div class="weather-popup-header">
                        <span style="color: var(--accent-blue); font-weight:700; font-size:13px;">
                            <i class="fa-solid fa-anchor"></i> ${stn.name}
                        </span>
                        <span style="font-size:10px; background:rgba(0,240,255,0.15); color:var(--accent-blue); padding:2px 5px; border-radius:4px;">${stn.id}</span>
                    </div>
                    <div style="font-size:10px; color:var(--text-muted); margin-bottom:6px;">
                        관측시각: ${stn.obsTime}
                    </div>
                    <div class="weather-popup-grid">
                        <div class="weather-popup-box">
                            <div class="label">해상 기온 (TA)</div>
                            <div class="val">${stn.tempC} ℃</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">해상 풍속 (WS)</div>
                            <div class="val">${stn.windMs} m/s (${stn.windKnot} kt)</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">상대 습도 (HM)</div>
                            <div class="val">${stn.humidity} %</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">유의 파고 (WV_HT)</div>
                            <div class="val" style="color:${stn.waveHeightM >= 2.0 ? '#ef4444' : '#10b981'};">${stn.waveHeightM} m</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">낙뢰 위험도</div>
                            <div class="val" style="font-size:10px; color:#f59e0b;">${stn.lightningRisk}</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">현지 기압 (PA)</div>
                            <div class="val">${stn.pressureHpa} hPa</div>
                        </div>
                    </div>
                    <div style="background: rgba(11,19,43,0.9); padding: 6px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); font-size: 11px;">
                        <b>선형회귀 체감온도(AT):</b> <span style="color:${stn.riskColor}; font-weight:bold;">${stn.apparentTemp} ℃</span> (${stn.riskLevel})
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
        });
    }

    function renderSelectedRoute() {
        const routeKey = routeSelect.value;
        const selectedRoute = window.MARITIME_ROUTES[routeKey];
        if (!selectedRoute) return;

        originalRouteLayer.clearLayers();
        optimizedRouteLayer.clearLayers();
        markerLayer.clearLayers();

        const severity = parseFloat(weatherSlider.value);
        weatherSliderVal.textContent = `${severity}x`;

        const optResult = optimizer.optimizeRoute(selectedRoute, severity);

        const normOrigWaypoints = normalizePacificLatLngs(selectedRoute.waypoints);
        const normOptWaypoints = normalizePacificLatLngs(optResult.waypoints);

        updateTopWeatherWidget(optResult.waypoints);

        const origLatLngs = normOrigWaypoints.map(wp => [wp.lat, wp.lng]);
        L.polyline(origLatLngs, {
            color: '#ef4444',
            weight: 3,
            dashArray: '6, 8',
            opacity: 0.75
        }).addTo(originalRouteLayer);

        const optLatLngs = normOptWaypoints.map(wp => [wp.lat, wp.lng]);
        const optPolyline = L.polyline(optLatLngs, {
            color: '#00f0ff',
            weight: 5,
            opacity: 0.95
        }).addTo(optimizedRouteLayer);

        map.fitBounds(optPolyline.getBounds(), { padding: [50, 50], maxZoom: 4 });

        animateVesselAlongRoute(normOptWaypoints);

        normOptWaypoints.forEach((wp, index) => {
            const isOrigin = index === 0;
            const isDest = index === normOptWaypoints.length - 1;

            let markerColor = wp.riskColor;
            if (isOrigin) markerColor = '#10b981';
            if (isDest) markerColor = '#a855f7';

            const marker = L.circleMarker([wp.lat, wp.lng], {
                radius: wp.isDetoured ? 8 : (isOrigin || isDest ? 9 : 5),
                fillColor: markerColor,
                color: '#ffffff',
                weight: 2,
                fillOpacity: 0.9
            }).addTo(markerLayer);

            const popupContent = `
                <div class="weather-popup-card">
                    <div class="weather-popup-header">
                        <span style="color: var(--accent-blue); font-weight:700; font-size:13px;">
                            ${wp.name}
                        </span>
                        <span style="font-size:10px; background:rgba(0,240,255,0.15); color:var(--accent-blue); padding:2px 5px; border-radius:4px;">WP #${index + 1}</span>
                    </div>

                    ${wp.isDetoured ? `<div style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; padding: 4px 6px; border-radius: 4px; font-size: 10px; margin-bottom: 6px;">⚠️ ${wp.detourReason}</div>` : ''}

                    <div class="weather-popup-grid">
                        <div class="weather-popup-box">
                            <div class="label">해상 기온 (TA)</div>
                            <div class="val">${wp.tempC} ℃</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">해상 풍속 (WS)</div>
                            <div class="val">${wp.windMs} m/s <span style="font-size:9px; color:#94a3b8;">(${wp.windKnot} kt)</span></div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">풍향 (WD)</div>
                            <div class="val">${wp.windDirectionText} (${wp.windDeg}°)</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">순간 풍속 (GUST)</div>
                            <div class="val">${wp.gustMs} m/s</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">유의 파고 (WV_HT)</div>
                            <div class="val" style="color:${wp.waveHeightM >= 2.5 ? '#ef4444' : '#10b981'};">${wp.waveHeightM} m</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">파주기 (WV_PRD)</div>
                            <div class="val">${wp.wavePeriodSec} 초</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">상대 습도 (HM)</div>
                            <div class="val">${wp.humidity} %</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">해수 수온 (TW)</div>
                            <div class="val">${wp.waterTempC} ℃</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">현지 기압 (PA)</div>
                            <div class="val">${wp.pressureHpa} hPa</div>
                        </div>
                        <div class="weather-popup-box">
                            <div class="label">해상 시정 (VIS)</div>
                            <div class="val">${wp.visibilityKm} km</div>
                        </div>
                    </div>

                    <div style="background: rgba(11,19,43,0.95); padding: 6px; border-radius: 6px; border: 1px solid rgba(0,240,255,0.2); font-size: 11px;">
                        <b>선형회귀 체감온도(AT):</b> <span style="color:${wp.riskColor}; font-weight:bold;">${wp.apparentTemp} ℃</span><br>
                        <b>선원 온열 안전도:</b> <span style="color:${wp.riskColor}; font-weight:bold;">${wp.riskLevel}</span><br>
                        <span style="font-size:10px; color:#94a3b8;">• 특보: ${wp.advisory}</span>
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
        });

        summaryRouteName.textContent = optResult.routeName;
        summaryOrigDist.textContent = `${optResult.originalDistanceNm.toLocaleString()} NM`;
        summaryOptDist.textContent = `${optResult.optimizedDistanceNm.toLocaleString()} NM`;
        summarySafetyScore.textContent = `${optResult.safetyScore}점 / 100점`;
        summaryFuelSave.textContent = optResult.fuelSaveInfo;

        renderOceanBuoyMarkers();

        climateVisualizer.renderClimateHeatmap(severity);
        climateVisualizer.renderHazardZones(severity);
    }

    function runMultiDestinationAIRecommendation() {
        const severity = parseFloat(weatherSlider.value);
        const rankedRoutes = optimizer.recommendSafestRoute(window.MARITIME_ROUTES, severity);

        if (!recommendationContainer) return;

        let html = '<div class="recommendation-list">';

        rankedRoutes.forEach((route, idx) => {
            const isTop = idx === 0;
            const badgeBg = isTop ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.08)';
            const badgeColor = isTop ? 'var(--accent-blue)' : '#94a3b8';

            html += `
                <div class="recommendation-item ${isTop ? 'top-rank' : ''}" style="cursor: pointer;" onclick="document.getElementById('routeSelect').value='${route.routeId}'; document.getElementById('routeSelect').dispatchEvent(new Event('change'));">
                    <div class="recommendation-header">
                        <span class="rank-badge" style="background:${badgeBg}; color:${badgeColor}; border: 1px solid ${badgeColor};">
                            ${route.rankBadge}
                        </span>
                        <span style="font-size: 12px; font-weight: 700; color: var(--accent-emerald);">
                            안전 점수: ${route.safetyScore}점
                        </span>
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: #fff; margin-top: 3px;">
                        ${route.destinationName}
                    </div>
                    <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
                        • 평균 체감온도: <b style="color:#00f0ff;">${route.avgApparentTemp}℃</b> | 최대 풍속: ${route.maxWindMs}m/s (${window.msToKnot(route.maxWindMs)}kt) | 최고 파고: ${route.maxWaveM}m
                    </div>
                    <div style="font-size: 10px; color: #e2e8f0; margin-top: 3px; line-height: 1.3;">
                        ${route.recommendReason}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        recommendationContainer.innerHTML = html;

        if (rankedRoutes.length > 0) {
            routeSelect.value = rankedRoutes[0].routeId;
            renderSelectedRoute();
        }
    }

    function handleManualATCalculation() {
        const temp = parseFloat(calcTemp.value) || 0;
        const wind = parseFloat(calcWind.value) || 0;
        const humidity = parseFloat(calcHumidity.value) || 0;

        const res = window.calculateOceanApparentTemp(temp, wind, humidity);

        resultAT.textContent = `${res.apparentTemp} ℃`;
        resultAT.style.color = res.riskColor;

        resultRisk.textContent = `${res.riskLevel} (${res.windSpeedKnot} kt)`;
        resultRisk.style.color = res.riskColor;

        resultDesc.textContent = res.description;
    }

    function switchMapTile(newTileLayer, activeBtn) {
        if (currentTileLayer) map.removeLayer(currentTileLayer);
        map.addLayer(newTileLayer);
        currentTileLayer = newTileLayer;

        [btnTileDark, btnTileSat, btnTileOcean].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');

        setTimeout(() => map.invalidateSize(), 150);
    }

    if (btnTileSat) btnTileSat.addEventListener('click', () => switchMapTile(satelliteTile, btnTileSat));
    if (btnTileDark) btnTileDark.addEventListener('click', () => switchMapTile(darkTile, btnTileDark));
    if (btnTileOcean) btnTileOcean.addEventListener('click', () => switchMapTile(oceanTile, btnTileOcean));

    routeSelect.addEventListener('change', renderSelectedRoute);
    weatherSlider.addEventListener('input', () => {
        weatherSliderVal.textContent = `${weatherSlider.value}x`;
    });
    btnSimulate.addEventListener('click', renderSelectedRoute);
    btnCalculateAT.addEventListener('click', handleManualATCalculation);

    if (btnRecommendSafest) {
        btnRecommendSafest.addEventListener('click', runMultiDestinationAIRecommendation);
    }

    if (chkShowBuoy) {
        chkShowBuoy.addEventListener('change', renderOceanBuoyMarkers);
    }

    if (btnToggleClimate) {
        btnToggleClimate.addEventListener('click', () => {
            btnToggleClimate.classList.toggle('active');
            const isActive = btnToggleClimate.classList.contains('active');
            climateVisualizer.toggleClimateHeatmap(isActive);
        });
    }

    if (btnToggleHazard) {
        btnToggleHazard.addEventListener('click', () => {
            btnToggleHazard.classList.toggle('active');
            const isActive = btnToggleHazard.classList.contains('active');
            climateVisualizer.toggleHazardZones(isActive);
        });
    }

    renderSelectedRoute();
    handleManualATCalculation();
    runMultiDestinationAIRecommendation();
});
