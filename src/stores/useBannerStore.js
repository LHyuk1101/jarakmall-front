import { create } from 'zustand';
import Frame2 from '../images/Frame2.png';
import Frame3 from '../images/Frame3.png';
import Frame4 from '../images/Frame4.png';
import Frame5 from '../images/Frame5.png';
import Frame6 from '../images/Frame6.png';

const useBannerStore = create(set => ({
  banners: [Frame2, Frame3, Frame4, Frame5, Frame6],
  currentBanner: 0,
  setCurrentBanner: (index) => set({ currentBanner: index }),
}));

export default useBannerStore;
