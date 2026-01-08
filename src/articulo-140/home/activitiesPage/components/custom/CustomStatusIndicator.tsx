import type { Estado } from "@/articulo-140/types/types";
import { gestionActivitiesStore } from "@/articulo-140/utils/gestionActivitiesPage/stores/gestionActivitiesStore";


interface customStatusIndicatorProps{
    status:string | number;
    activityId?:string;
    showLabel?:boolean;
}

export const CustomStatusIndicator = ({status,activityId,showLabel=false}:customStatusIndicatorProps) => {
    const {numberToStatus,getStatusCircleColor,getStatusLabel,getActivityEstatus} = gestionActivitiesStore();

    const savedStatus=activityId ? getActivityEstatus(activityId):null;
    const estado:Estado = savedStatus ?? numberToStatus(status);
    const circleColor = getStatusCircleColor(estado);
    const label = getStatusLabel(estado);

    return showLabel ? (
        <div className="flex items-center gap-2 bg-white/95 rounded-lg px-2 py-1 shadow-sm">
            <div className={`h-3 w-3 rounded-full ${circleColor} shadow-sm`} />
            <span className="text-xs text-gray-600 font-medium">{label}</span>
        </div>
    ):(<div className={`h-4 w-4 rounded-full ${circleColor} shadow-md`} title={label}/>)
}
