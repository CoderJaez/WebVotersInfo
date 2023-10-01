import { VoterInfo } from "types";
import { create } from "zustand";

interface ClassroomState {
  voters: VoterInfo[];
  addOneVoter: (data: VoterInfo) => void;
  setVoters: (data: VoterInfo[]) => void;
  removeOneVoter: (id: string) => void;
}

const useVoterStore = create<ClassroomState>()((set) => ({
  voters: [],
  addOneVoter: (data: VoterInfo) =>
    set((state) => ({ voters: [data, ...state.voters] })),
  setVoters: (data: VoterInfo[]) => set(() => ({ voters: data })),
  removeOneVoter: (id: string) =>
    set((state) => ({
      voters: state.voters?.filter((room) => room._id !== id),
    })),
}));

export default useVoterStore;
