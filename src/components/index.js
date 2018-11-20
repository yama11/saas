import AppCheckBox from './AppCheckBox';
import AppCheckMap from './AppCheckMap';
import AppInputPassword from './AppInputPassword';
import AppFormAlert from './AppFormAlert';
import AppSearch from './AppSearch';
import AppList from './AppList';
import AppForm from './AppForm/Main';
import AppFormPage from './AppForm/AppFormPage';
import AppFormDialog from './AppForm/AppFormDialog';
import AppCropUploader from './AppCropUploader';
import AppUploader from './AppUploader';
import AppUploadScale from './AppUploadScale';
import AppTextArea from './AppTextArea';
import AppUploadSize from './AppUploadSize';
import AppQRCode from './AppQRCode';

const components = {
  AppCheckBox,
  AppCheckMap,
  AppInputPassword,
  AppFormAlert,
  AppSearch,
  AppList,
  AppForm,
  AppFormPage,
  AppFormDialog,
  AppCropUploader,
  AppUploader,
  AppUploadScale,
  AppTextArea,
  AppUploadSize,
  AppQRCode,
};

export default (Vue) => {
  Object.keys(components)
    .forEach(name => Vue.component(name, components[name]));
};
