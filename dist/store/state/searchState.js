import { atom } from 'recoil';
import { SearchStatus } from '../types';
export const searchState = atom({
    key: 'search',
    default: { args: {}, status: SearchStatus.OK }
});
//# sourceMappingURL=searchState.js.map