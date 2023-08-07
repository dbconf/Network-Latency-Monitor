document.addEventListener('DOMContentLoaded', function() {
const styleElement = document.createElement('style');
styleElement.innerHTML = `
    #latency-display-container {
        display: flex;
        align-items: center;
        background-color: rgba(255, 255, 255, 1);
        padding: 1px 5px;
        border-radius: 10px;
        color: black;
        font-size: 9px;
        position: fixed;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        white-space: nowrap;
    }
`;
    document.head.appendChild(styleElement);

    const defaultUrls = [
        { name: '腾讯', url: 'www.qq.com' },
        { name: 'GitHub', url: 'api.github.com' },
        { name: '谷歌', url: 'www.google.com' },
    ];
    
    const currentHost = window.location.hostname;
    defaultUrls.unshift({ name: '本站', url: currentHost });
    
    const refreshFrequency = 3000;
    let latencyData = {};

    function calculateLatency(url, callback) {
        const startTime = new Date().getTime();
        fetch('https://' + url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' })
            .then(response => {
                const endTime = new Date().getTime();
                const latency = endTime - startTime;
                callback(url, latency);
            })
            .catch(error => {
                callback(url, 'Timeout');
            });
    }

    function updateLatency() {
        defaultUrls.forEach(item => {
            calculateLatency(item.url, (url, latency) => {
                latencyData[item.name] = latency;
                updateDisplay();
            });
        });
    }

    function updateDisplay() {
        const displayContainer = document.getElementById('latency-display-container');
        if (displayContainer) {
            let displayHtml = '';
            for (const item of defaultUrls) {
                const name = item.name;
                const latency = latencyData[name];
                displayHtml += name + ': <span style="color: ' + getLatencyColor(latency) + '; font-weight: bold;">' + formatLatency(latency) + '</span>|';
            } 
            displayContainer.innerHTML = displayHtml;
        }
    }

    function formatLatency(latency) {
        return latency === 'Timeout' ? '超时' : latency + 'ms';
    }

    function getLatencyColor(latency) {
        if (latency === 'Timeout') {
            return 'gray';
        } else if (latency < 300) {
            return 'darkgreen';
        } else if (latency < 600) {
            return 'green';
        } else if (latency <= 1000) {
            return 'yellowgreen';
        } else if (latency <= 2000) {
            return 'orange';
        } else {
            return 'red';
        }
    }
  
    const displayContainer = document.createElement('div');
    displayContainer.id = 'latency-display-container';
    document.body.appendChild(displayContainer);
  
    setInterval(updateLatency, refreshFrequency);
    updateLatency();
});
