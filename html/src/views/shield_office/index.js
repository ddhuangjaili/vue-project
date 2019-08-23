const user = () =>
    import ( /* webpackChunkName: "shield_office-1.0.2" */ './pages/user');
const userApprove = () =>
    import ( /* webpackChunkName: "shield_office-1.0.2" */ './pages/userApprove');
const forgetPwd = () =>
    import ( /* webpackChunkName: "shield_office-1.0.2" */ './pages/forgetPwd');
const black = () =>
    import ( /* webpackChunkName: "shield_office-1.0.2" */ './pages/black');
const uploadBlack = () =>
    import ( /* webpackChunkName: "shield_office-1.0.2" */ './pages/uploadBlack');
const exportBlack = () =>
    import ( /* webpackChunkName: "shield_office-1.0.2" */ './pages/exportBlack');
export default [{
        path: '/shield_office/user',
        component: user
    },
    {
        path: '/shield_office/userApprove',
        component: userApprove
    },
    {
        path: '/shield_office/forgetPwd',
        component: forgetPwd
    },
    {
        path: '/shield_office/black',
        component: black
    },
    {
        path: '/shield_office/uploadBlack',
        component: uploadBlack
    },
    {
        path: '/shield_office/exportBlack',
        component: exportBlack
    }
]