import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { GraduationCap, Settings, UserCog, type LucideProps } from "lucide-react"
import { SideBarActivitiesContext, type item } from "../context/SideBarActivitiesContext";
import { use, type ForwardRefExoticComponent } from "react";
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors";



interface detailsActivities{
        id: item,
        title: string,
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
        group: string,
}

const sections:detailsActivities[] = [
    {
        id: "General",
        title: "General",
        icon: Settings,
        group: "Access",
    },
    {
        id: "Students",
        title: "Estudiantes",
        icon: GraduationCap,
        group: "Access",
    },
    {
        id: "controlZona",
        title: "Zona de Control", 
        icon: UserCog,
        group: "Configuraciones avanzadas",
    },
]


export const CustomSidebarAdActivities = () => {
    const {onSelection, itemsSelected} = use(SideBarActivitiesContext);

    const groupedSections = sections.reduce(
        (acc, section) => {
            if (!acc[section.group]) {
                acc[section.group] = []
            }
            acc[section.group].push(section)
            return acc
        },
        {} as Record<string, typeof sections>,
    )


    return (
        <SidebarContent className="flex-1 overflow-auto">
            {Object.entries(groupedSections).map(([groupName, groupSections]) => (
                <SidebarGroup key={groupName}>
                    <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {groupName}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {groupSections.map((section) => {
                                const Icon = section.icon
                                return (
                                    <SidebarMenuItem key={section.id}>
                                        <SidebarMenuButton
                                          className="w-full justify-start"
                                          onClick={() => onSelection(section.id)}
                                          style={itemsSelected === section.id
                                            ? { background: UNAH_BLUE_SOFT, color: UNAH_BLUE, fontWeight: 600 }
                                            : {}}
                                        >
                                            <Icon className="h-4 w-4" style={itemsSelected === section.id ? { color: UNAH_BLUE } : {}} />
                                            <span>{section.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </SidebarContent>
    )
}
