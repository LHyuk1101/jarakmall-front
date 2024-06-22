import {create} from 'zustand';
import data from '../pages/data.js'; // 기존의 데이터 파일 import

const useProductStore = create(set => ({
  items: data,
  setItems: (newItems) => set({ items: newItems }),
}));

export default useProductStore;
