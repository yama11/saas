import ProductList from './index.vue';
import ProductForm from './Form';

export default [
  // 商品列表
  {
    path: 'product-list',
    name: 'ProductList',
    component: ProductList,
  },
  // 商品创建
  {
    path: 'product-create',
    name: 'ProductCreate',
    component: ProductForm,
  },
  // 商品编辑
  {
    path: 'product-edit/:id',
    name: 'ProductEdit',
    component: ProductForm,
  },
  // 商品查看
  {
    path: 'product-look/:id',
    name: 'ProductLook',
    component: ProductForm,
  },
];
