import AppInputPassword from './AppInputPassword';

const components = {
  AppInputPassword,
};

export default (Vue) => {
  Object.keys(components)
    .forEach(name => Vue.component(name, components[name]));
};
