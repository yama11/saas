import AppInputPassword from './AppInputPassword';
import AppFormAlert from './AppFormAlert';

const components = {
  AppInputPassword,
  AppFormAlert,
};

export default (Vue) => {
  Object.keys(components)
    .forEach(name => Vue.component(name, components[name]));
};
