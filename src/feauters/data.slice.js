import { createSlice } from '@reduxjs/toolkit';

const singleVehicle = createSlice({
  name: 'vehcile',
  initialState: {
    singleVehicleData: null,
  },
  reducers: {
    addSingleVehicleData: (state, action) => {
      // console.log('action',action.payload)
     state.singleVehicleData=action.payload
    },
    clearSingleVehcileData:(state)=>{
      state.singleVehicleData=null
    }
    // Other reducers
  },
});

export const { addSingleVehicleData,clearSingleVehcileData } = singleVehicle.actions;
export default singleVehicle.reducer;
