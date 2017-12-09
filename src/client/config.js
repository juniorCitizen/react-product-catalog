const api = 'http://localhost:9004/reactProductCatalog/api'

export default {
    api: api,
    route: {
        productMenu: api + '/productMenus',
        register: api + '/contacts',
        tokens: api + '/tokens',
    },
    project: {
        name: 'reactProductCatalog',
    },
    contact: {
        name: '秀田醫療器材有限公司',
        info: {
            address: '嘉義市保忠三街116號',
            tel: '(05)2755-699',
            fax: '(05)2755-099',
            mail: '615666@gmail.com',
            
        },
        slogan: '醫療專業 貼心服務',
    }
}

// note
/*
get local storage
    let value = window.localStorage["local"];
set local storage
    window.localStorage["local"] = value;
get session
    let value = window.sessionStorage["session"];
set session
    window.sessionStorage["session"] = value;

*/
