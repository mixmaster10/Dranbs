const env = process.env.NODE_ENV || 'development';
const config = {
    development: require('./development.js').default,
    production: require('./production.js').default,
};

const general = {};

export default {...general, ...config[env]};
