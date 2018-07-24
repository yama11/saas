import AppInputPassword from './AppInputPassword';
import AppFormAlert from './AppFormAlert';
import AppSearch from './AppSearch';
import AppList from './AppList';
import AppForm from './AppForm/Main';
import AppFormPage from './AppForm/AppFormPage';
import AppFormDialog from './AppForm/AppFormDialog';
import AppCropUploader from './AppCropUploader';

const components = {
  AppInputPassword,
  AppFormAlert,
  AppSearch,
  AppList,
  AppForm,
  AppFormPage,
  AppFormDialog,
  AppCropUploader,
};

export default (Vue) => {
  Object.keys(components)
    .forEach(name => Vue.component(name, components[name]));
};
