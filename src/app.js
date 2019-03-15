import router from 'umi/router';
import { getCurrentUser, getUser } from './utils/login';
import './global.less';

export async function render(oldRender) {
  await getCurrentUser();
  oldRender();
}