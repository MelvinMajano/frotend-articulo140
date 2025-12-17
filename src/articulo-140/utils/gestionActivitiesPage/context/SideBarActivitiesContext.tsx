import type { PropsWithChildren } from "react"
import { createContext, useMemo, useCallback} from "react"
import { useSearchParams } from "react-router";

export type item = 'General' | 'Students' | 'controlZona';

interface SideBarActivitiesContext{
   //props
   itemsSelected:item | string | null;

   //methods
   onSelection: (value:item)=>void;
};




export const SideBarActivitiesContext = createContext({} as SideBarActivitiesContext)

export const SideBarActivitiesProvider = ({children}:PropsWithChildren) => {
    const [searchParams, setSerchParams] = useSearchParams();
    
    const handleSelectionItem = useCallback((value:item)=>{ 
        setSerchParams((prev)=>{
            prev.set('seccionDetails',value);
            return prev
        })
    }, [setSerchParams]);

    const selectSeccion = searchParams.get("seccionDetails");
    
    const contextValue = useMemo(() => ({
        itemsSelected: selectSeccion,
        onSelection: handleSelectionItem,
    }), [selectSeccion, handleSelectionItem]);
    
    return (
    <SideBarActivitiesContext
    value={contextValue}
    >
        {children}
    </SideBarActivitiesContext>
  )
}
