import { createRouter } from 'expo-router';
import App from './App';

const router = createRouter({
  home: {
    path: '/',
    screen: App,
  },
  // Добавьте другие маршруты здесь, если есть
});

export default router;