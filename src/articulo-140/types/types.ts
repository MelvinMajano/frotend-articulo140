export type Estado = 'pendiente'|'en-progreso'|'finalizado';
export type statusNumber = 1 | 2 | 3 ;
export type DBStatus = 'pending' | 'inProgress' | 'finished';

export const STATUS_MAP:Record<Estado,statusNumber>={
    'pendiente':1,
    'en-progreso':2,
    'finalizado':3
}

export const REVERSE_STATUS_MAP:Record<statusNumber,Estado> ={
    1: 'pendiente',
    2:'en-progreso',
    3: 'finalizado'
}

// Mapeo de strings de la BD → Estado del frontend
export const DB_STATUS_MAP: Record<DBStatus, Estado> = {
    'pending': 'pendiente',
    'inProgress': 'en-progreso',
    'finished': 'finalizado'
};

// Mapeo inverso: Estado del frontend → string de BD
export const ESTADO_TO_DB_MAP: Record<Estado, DBStatus> = {
    'pendiente': 'pending',
    'en-progreso': 'inProgress',
    'finalizado': 'finished'
};

export const STATUS_CONFIG:Record<Estado,{color:string,circleColor:string,label:string}>={
    pendiente:{
        color:'bg-blue-100 text-blue-700 border-blue-300',
        circleColor:'bg-blue-500',
        label: 'Pendiente'
    },
    'en-progreso':{
        color:'bg-green-100 text-green-700 border-green-300',
        circleColor:'bg-green-500',
        label: 'En progreso'
    },
    finalizado:{
        color:'bg-amber-100 text-amber-700 border-amber-300',
        circleColor:'bg-amber-500',
        label: 'Finalizado'
    }
}
