export type Estado = 'pendiente'|'en-progreso'|'finalizado' | 'Enviado a Sudecad' | 'submittedToSudecad' | 'Externo';
export type statusNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type DBStatus = 'pending' | 'inProgress' | 'finished' | 'submittedToSudecad' | 'approvedBySudecad' | 'external';

export const STATUS_MAP:Record<Estado,statusNumber>={
    'pendiente':1,
    'en-progreso':2,
    'finalizado':3,
    'Enviado a Sudecad':4,
    'submittedToSudecad':5,
    'Externo':6
}

export const REVERSE_STATUS_MAP:Record<statusNumber,Estado> ={
    1: 'pendiente',
    2:'en-progreso',
    3: 'finalizado',
    4: 'Enviado a Sudecad',
    5: 'submittedToSudecad',
    6: 'Externo'
}

// Mapeo de strings de la BD → Estado del frontend
export const DB_STATUS_MAP: Record<DBStatus, Estado> = {
    'pending': 'pendiente',
    'inProgress': 'en-progreso',
    'finished': 'finalizado',
    'submittedToSudecad': 'Enviado a Sudecad',
    'approvedBySudecad': 'submittedToSudecad',
    'external': 'Externo'
};

// Mapeo inverso: Estado del frontend → string de BD
export const ESTADO_TO_DB_MAP: Record<Estado, DBStatus> = {
    'pendiente': 'pending',
    'en-progreso': 'inProgress',
    'finalizado': 'finished',
    'Enviado a Sudecad': 'submittedToSudecad',
    'submittedToSudecad': 'approvedBySudecad',
    'Externo': 'external'
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
    },
    'Enviado a Sudecad':{
        color:'bg-purple-100 text-purple-700 border-purple-300',
        circleColor:'bg-purple-500',
        label: 'Enviado a Sudecad'
    },
    'submittedToSudecad':{
        color:'bg-gray-100 text-gray-700 border-gray-300',
        circleColor:'bg-gray-500',
        label: 'Submitted to Sudecad'
    },
    Externo:{
        color:'bg-pink-100 text-pink-700 border-pink-300',
        circleColor:'bg-pink-500',
        label: 'Externo'
    }
}
