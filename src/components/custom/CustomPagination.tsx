import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useSearchParams } from "react-router";
import { UNAH_BLUE, UNAH_BLUE_GRADIENT, UNAH_BLUE_SOFT } from "@/lib/colors";

interface props{
  totalPages: number;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  activeBgColor?: string;
  activeBorderColor?: string;
  activeTextColor?: string;
}

export const CustomPagination = ({
  totalPages,
  bgColor = UNAH_BLUE_SOFT,
  borderColor = UNAH_BLUE,
  textColor = UNAH_BLUE,
  activeBgColor = UNAH_BLUE,
  activeBorderColor = UNAH_BLUE_GRADIENT,
  activeTextColor = "#ffffff",
}: props) => {
  const [searchParams,setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') ?? '1';
  const page = isNaN(+queryPage) ? 1 : Number(queryPage);

  const handlePageChange = (page: number) => {
    if(page < 1 || page > totalPages) return;
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  }

  return (
    <div className="flex items-center justify-center space-x-2 space-y-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        style={{ background: bgColor, borderColor, color: textColor }}
        className="hover:brightness-95 transition-all duration-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Anteriores
      </Button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(index + 1)}
          style={page === index + 1
            ? { background: activeBgColor, color: activeTextColor, border: `2px solid ${activeBorderColor}`, fontWeight: 700, boxShadow: `0 2px 8px 0 ${bgColor}80` }
            : { background: bgColor, borderColor, color: textColor }
          }
          className="transition-all duration-200 hover:brightness-95"
        >
          {index + 1}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        style={{ background: bgColor, borderColor, color: textColor }}
        className="hover:brightness-95 transition-all duration-200"
      >
        Siguientes
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
