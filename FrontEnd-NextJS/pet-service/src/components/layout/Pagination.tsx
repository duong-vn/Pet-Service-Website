import { scrollWindowToTop } from "@/apiServices/services"
import { ServiceParams } from "@/hooks/services-hook"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface IProps{
    current: number,
    limit: number,
    setParams:(params:any)=>void
    totalItems: number,
    totalPage: number
}

export default function Pagination({current, limit, totalItems, setParams, totalPage}: IProps){

    const setCurrent = (current: number) => {
        setParams((p: ServiceParams) => ({...p, current}))
    }

    
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPage <= maxVisiblePages) {
           
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i);
            }
        } else {
          
            if (current <= 3) {
                // Near start
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPage);
            } else if (current >= totalPage - 2) {
                
                pages.push(1);
                pages.push('...');
                for (let i = totalPage - 3; i <= totalPage; i++) {
                    pages.push(i);
                }
            } else {
               
                pages.push(1);
                pages.push('...');
                for (let i = current - 1; i <= current + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPage);
            }
        }
        
        return pages;
    }

    if (totalPage <= 1) return null;

    return (
        <div className="flex items-center justify-center mt-8 gap-2">
            {/* Previous button */}
            <button 
                onClick={() =>{ setCurrent(current - 1);scrollWindowToTop()}} 
                disabled={current === 1}
                className={`flex text-black dark:text-white  items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    current === 1 
                        ? 'border-gray-300 text-gray-400 dark:border-white/50 dark:text-white/30 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-700 hover:bg-secondary-light dark:hover:bg-primary-dark hover:border-gray-400'
                }`}
            >
                <ChevronLeft className="w-4 h-4" />
                Trước
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() =>{ 
                            typeof page === 'number' ?
                           ( ()=>{
                             setCurrent(page)
                             scrollWindowToTop() })()  
                             : 
                             null}}
                        disabled={typeof page !== 'number'}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                            page === current
                                ? 'bg-secondary-dark dark:bg-secondary-light text-white dark:text-black '
                                : typeof page === 'number'
                                ? 'border-gray-300   hover:bg-secondary-light dark:hover:bg-primary-dark   hover:border-gray-400'
                                : 'border-transparent text-black dark:text-white  cursor-default'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next button */}
            <button 
                onClick={() => {
                    
                    setCurrent(current + 1)
                scrollWindowToTop()
            }
                } 
                disabled={current === totalPage}
                className={`flex items-center text-black dark:text-white  gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    current === totalPage 
                        ? 'border-gray-300 text-gray-400 dark:border-white/50 dark:text-white/30 cursor-not-allowed' 
                        : 'border-gray-300 text-gray-700 hover:bg-secondary-light dark:hover:bg-primary-dark hover:border-gray-400'
                }`}
            >
                Sau
                <ChevronRight className="w-4 h-4" />
            </button>

            {/* Info text */}
            <div className="ml-4 text-sm text-gray-500">
                Trang {current} của {totalPage} ({totalItems} dịch vụ)
            </div>
        </div>
    )
}