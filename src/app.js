import router from 'umi/router';
import { getCurrentUser, getUser } from './utils/login';

export async function render(oldRender) {
  await getCurrentUser();
  oldRender();
}