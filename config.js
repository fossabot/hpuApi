const CONFIGS = {
    'edu': { // 树维教务系统
        'url': 'http://zhjw.hpu.edu.cn/eams',
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
            'Origin': 'http://zhjw.hpu.edu.cn'
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
        'core_url': 'https://coreapi.mosoteach.cn',
        'headers': {
            'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10.0.0; MI 9 Build/NMF26X)',
            'X-app-machine': 'MI 10',
            'X-app-system-version': '10.0.0',
            'Accept-Language': 'zh-CN'
        }
    },
}

module.exports = CONFIGS;