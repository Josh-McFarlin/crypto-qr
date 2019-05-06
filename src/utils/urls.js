export default {
    home: () => '/',
    auth: () => '/login',
    recent: () => '/recent',
    qr: {
        create: () => '/qr',
        view: (id) => `/qr/${id}`,
        edit: (id) => `/qr/${id}/edit`
    },
    profile: {
        view: (id) => `/profile${id ? `/${id}` : ''}`,
        edit: () => '/profile/edit'
    }
};
