import { create } from 'zustand'
import { disableActivity } from '../actions/DesableActivitie.action';
import { getIsDisableActivy } from '../actions/getIsDisableActivy.action';
import { REVERSE_STATUS_MAP, STATUS_CONFIG, STATUS_MAP, DB_STATUS_MAP, type Estado, type statusNumber, type DBStatus } from '@/articulo-140/types/types';

interface props{
  id:string|undefined,
  isDisableSet:number
}


type gestionStore = {
  isDisableget: string | null; 
  isDisable:number|null;
  activityStatuses:Record<string,Estado>;

  getStatusColor:(estado:Estado)=>string;
  getStatusCircleColor:(estado:Estado)=>string;
  getStatusLabel:(estado:Estado)=>string;
  statusToNumber:(estado:Estado)=>statusNumber;
  numberToStatus:(estatus: number | string)=>Estado;

  getActivityEstatus:(activityId:string)=> Estado | null;
  setActivityEstatus:(activityId:string, estado:Estado)=>void;

  getIsDisbleActivity:(id:string|undefined)=>Promise<0|1>;
  disbaleActivity:({id, isDisableSet}:props)=>Promise<string>;
  stateFunDisableActivity:()=>void;
  stateFunEnableActivity:()=>void;
}

export const gestionActivitiesStore = create<gestionStore>()((set,get) => ({
  isDisableget:null,
  newDisableSet: null,
  isDisable:null,
  activityStatuses:{},

  getStatusColor:(estado)=>STATUS_CONFIG[estado].color,
  getStatusCircleColor:(estado)=>STATUS_CONFIG[estado].circleColor,
  getStatusLabel:(estado)=>STATUS_CONFIG[estado].label,
  statusToNumber:(estado)=>STATUS_MAP[estado],
  numberToStatus:(estatus)=>{
    // Si es string de la BD (pending, inProgress, finished)
    if (typeof estatus === 'string' && estatus in DB_STATUS_MAP) {
      return DB_STATUS_MAP[estatus as DBStatus];
    }
    // Si es número (1, 2, 3)
    const num = typeof estatus === 'string' ? Number(estatus) : estatus;
    return REVERSE_STATUS_MAP[num as statusNumber] ?? 'pendiente';
  },

  getActivityEstatus: (activityId) => {
    return get().activityStatuses[activityId] ?? null;
  },

  setActivityEstatus:(activityId,estado)=>{
    set((state)=>({
      activityStatuses:{
        ...state.activityStatuses,
        [activityId]:estado
      }
    }))
  },


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

