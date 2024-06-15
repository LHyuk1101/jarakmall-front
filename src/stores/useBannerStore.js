import {create} from 'zustand';
import BgImg from '../images/bg.png'; // BgImg를 임포트

const useBannerStore = create(set => ({
  mainBanner: localStorage.getItem('mainBanner') || BgImg,
  setMainBanner: (banner) => {
    localStorage.setItem('mainBanner', banner);
    set({ mainBanner: banner });
  }
}));

export default useBannerStore;
