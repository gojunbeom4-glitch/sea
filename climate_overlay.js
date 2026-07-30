/**
 * ============================================================================
 * [회전하는 태풍 이모지(🌀), 뇌우(🌩️), 파도(🌊) visualizer 모듈]
 * ============================================================================
 */

class GlobalOceanClimateVisualizer {
    constructor(map) {
        this.map = map;
        this.heatmapLayerGroup = L.layerGroup().addTo(map);
        this.hazardLayerGroup = L.layerGroup().addTo(map);
        this.isVisibleClimate = false;
        this.isVisibleHazard = true;
    }

    renderClimateHeatmap(weatherSeverity = 1.0) {
        this.heatmapLayerGroup.clearLayers();
        if (!this.isVisibleClimate) return;

        const zones = [
            { lat: 10, lng: 135, radius: 1200000, color: '#ef4444', label: '열대 고체감온도 해역 (33℃+)' },
            { lat: 25, lng: 165, radius: 1500000, color: '#f59e0b', label: '태평양 고온 다습 구역' },
            { lat: 45, lng: 170, radius: 1100000, color: '#00f0ff', label: '북태평양 한류 온대 구역' },
            { lat: 15, lng: 65, radius: 1400000, color: '#a855f7', label: '인도양 난류 해역' }
        ];

        zones.forEach(z => {
            const circle = L.circle([z.lat, z.lng], {
                color: z.color,
                fillColor: z.color,
                fillOpacity: 0.18 * weatherSeverity,
                radius: z.radius * weatherSeverity,
                weight: 1
            }).addTo(this.heatmapLayerGroup);

            circle.bindTooltip(`<b>${z.label}</b>`, { permanent: false, direction: 'center' });
        });
    }

    renderHazardZones(weatherSeverity = 1.0) {
        this.hazardLayerGroup.clearLayers();
        if (!this.isVisibleHazard) return;

        // 1. 회전하는 태풍 이모티콘 마커 (GAEMI)
        const typhoonLat = 18.5;
        const typhoonLng = 138.0 + (weatherSeverity - 1.0) * 10.0;

        const typhoonIcon = L.divIcon({
            className: 'custom-typhoon-emoji',
            html: `<div class="emoji-typhoon-icon">🌀</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const typhoonMarker = L.marker([typhoonLat, typhoonLng], { icon: typhoonIcon }).addTo(this.hazardLayerGroup);
        typhoonMarker.bindPopup(`
            <div class="weather-popup-card">
                <div class="weather-popup-header">
                    <span style="color:#ef4444; font-weight:700; font-size:14px;">🌀 초강력 태풍 (GAEMI)</span>
                    <span style="font-size:10px; background:rgba(239,68,68,0.2); color:#ef4444; padding:2px 6px; border-radius:4px;">경보</span>
                </div>
                <div style="font-size:11px; line-height:1.5;">
                    • <b>중심 기압:</b> 945 hPa<br>
                    • <b>최대 풍속:</b> 42.0 m/s (81.6 kt)<br>
                    • <b>유의 파고:</b> 7.5 m (너울성 고파도)<br>
                    • <b>예측 경로:</b> 대만 해협 ➔ 동시나해 북상 중
                </div>
            </div>
        `);

        // 2. 뇌우/폭풍우 이모지 마커
        const stormIcon = L.divIcon({
            className: 'custom-storm-emoji',
            html: `<div class="emoji-storm-icon">🌩️</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const stormMarker = L.marker([48.0, 172.0], { icon: stormIcon }).addTo(this.hazardLayerGroup);
        stormMarker.bindPopup(`
            <div class="weather-popup-card">
                <div class="weather-popup-header">
                    <span style="color:#f59e0b; font-weight:700; font-size:14px;">🌩️ 알류산 고위도 뇌우해역</span>
                </div>
                <div style="font-size:11px; line-height:1.5;">
                    • <b>순간 풍속:</b> 22.8 m/s (44.3 kt)<br>
                    • <b>파도 주기:</b> 11.5 초 (주기 긴 위험파)
                </div>
            </div>
        `);

        // 3. 거대 파도 이모지 마커
        const waveIcon = L.divIcon({
            className: 'custom-wave-emoji',
            html: `<div class="emoji-wave-icon">🌊</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const waveMarker = L.marker([8.0, 60.0], { icon: waveIcon }).addTo(this.hazardLayerGroup);
        waveMarker.bindPopup(`
            <div class="weather-popup-card">
                <div class="weather-popup-header">
                    <span style="color:#00f0ff; font-weight:700; font-size:14px;">🌊 인도양 몬순 고파도 해역</span>
                </div>
                <div style="font-size:11px; line-height:1.5;">
                    • <b>유의 파고:</b> 4.2 m<br>
                    • <b>풍랑 특보:</b> 선박 저속 우회 운항 요망
                </div>
            </div>
        `);
    }

    toggleClimateHeatmap(show) {
        this.isVisibleClimate = show;
        this.renderClimateHeatmap();
    }

    toggleHazardZones(show) {
        this.isVisibleHazard = show;
        this.renderHazardZones();
    }
}

window.GlobalOceanClimateVisualizer = GlobalOceanClimateVisualizer;
