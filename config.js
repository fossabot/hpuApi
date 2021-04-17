const CONFIGS = {
    'edu': { // 树维教务系统
        'url': 'http://218.196.248.100/eams',
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
            'Origin': 'http://218.196.248.100'
        }
    },
    'lib': { // 利昂图书馆系统
        'url': 'http://seatlib.hpu.edu.cn',
        'headers': {
            'User-Agent': 'doSingle/11 CFNetwork/811.5.4 Darwin/16.6.0',
        }
    },
    'uia': { // UIA统一身份认证
        'url': 'https://uia.hpu.edu.cn',
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
        }
    },
    'ybk': { // 云班课
        'url': 'https://api.mosoteach.cn/mssvc/index.php',
        'headers': {
            'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10.0.0; MI 9 Build/NMF26X)',
            'X-app-id': 'MTANDROID',
            'X-app-version': '5.3.2',
            'X-dpr': '2.0',
            'X-app-machine': 'MI 10',
            'X-app-system-version': '10.0.0'
        }
    },
}

module.exports = CONFIGS;