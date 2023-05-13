import Container from 'dinjectease';
import sites from './sites';

const container = new Container();

export default container;

const siteCode = process.env.SITE || 'default';

container.raw('site_config', sites[siteCode]);
