import AppInputPassword from './AppInputPassword';
import AppFormAlert from './AppFormAlert';
import AppSearch from './AppSearch';

const components = {
  AppInputPassword,
  AppFormAlert,
  AppSearch,
};

export default (Vue) => {
  Object.keys(components)
    .forEach(name => Vue.component(name, components[name]));
};
