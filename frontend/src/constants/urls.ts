const baseURL = 'http://localhost:8000/api';
const socketBaseUrl = 'ws://localhost/api';
const auth = '/auth';
const cars = '/cars';
const user = '/user';

const urls = {
    auth: {
        login: auth,
        socket: `${auth}/socket`,
    },
    cars: {
        base: cars,
        brands: `${cars}/brands`,
        models: `${cars}/models`,
        sendBrandRequestEmail: `${cars}/send_brand_request_email`,
    },
    user: {
        base: user,
        createSuperuser: `${user}/create-superuser`,
        createAdmin: `${user}/create-admin`,
        currentUser: `${user}/current-user`,

    }
};

export {
    baseURL,
    socketBaseUrl,
    urls
};
