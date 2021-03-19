const CONFIGS = {
    'edu': {
        'url': 'http://218.196.248.100/eams',
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
            'Origin': 'http://218.196.248.100'
        }
    },
    'lib': {
        'url': 'http://seatlib.hpu.edu.cn',
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
        }
    },
    'uia': {
        'url': 'https://uia.hpu.edu.cn',
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
        }
    },
}

module.exports = CONFIGS;