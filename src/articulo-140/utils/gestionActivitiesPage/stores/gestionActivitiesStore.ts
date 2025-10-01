import { create } from 'zustand'
import { disableActivity } from '../actions/DesableActivitie.action';
import { getIsDisableActivy } from '../actions/getIsDisableActivy.action';

interface props{
  id:string|undefined,
  isDisableSet:number
}


type gestionStore = {
  isDisableget: string | null; 
  isDisable:number|null;

  getIsDisbleActivity:(id:string|undefined)=>Promise<0|1>;

  disbaleActivity:({id, isDisableSet}:props)=>Promise<string>;

  stateFunDisableActivity:()=>void;
  stateFunEnableActivity:()=>void;
}

export const gestionActivitiesStore = create<gestionStore>()((set) => ({
  isDisableget:null,
  newDisableSet: null,
  isDisable:null,
  
  getIsDisbleActivity: async(id:string|undefined)=>{
      const isDisable = await getIsDisableActivy(id);
      const isDisabledNumber= (isDisable==='true')? 1:0
      set({isDisable:isDisabledNumber})
      return isDisabledNumber;
  },
  
  disbaleActivity: async({id, isDisableSet}:props)=>{
    const {message} = await disableActivity({id,isDisableSet});
    return message
  },

  stateFunDisableActivity:()=>{
    set({isDisable:1})
  },
  stateFunEnableActivity:()=>{
    set({isDisable:0})
  },
}))

