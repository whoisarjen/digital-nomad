import {
    Pagination as PaginationRaw,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { getCurrentPageNumber, getNextSearchParams } from "@/utils/link.utils"

type PaginationProps = {
    countOfPages: number
    paramKey: string
    searchParams: URLSearchParams
}
  
export function Pagination({
  countOfPages: countOfPagesRaw,
  paramKey,
  searchParams,
}: PaginationProps) {
    const countOfPages = Math.ceil(countOfPagesRaw)
    const currentPage = getCurrentPageNumber(searchParams)

    return (
        <PaginationRaw>
            <PaginationContent>
                {currentPage > 1 &&
                    <PaginationItem>
                        <PaginationPrevious href={getNextSearchParams(searchParams, paramKey, currentPage - 1)} />
                    </PaginationItem>
                }
                {currentPage - 1 > 0 &&
                    <PaginationItem>
                        <PaginationLink href={getNextSearchParams(searchParams, paramKey, 1)}>1</PaginationLink>
                    </PaginationItem>
                }
                {currentPage - 2 > 0 &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }
                <PaginationItem>
                    <PaginationLink href={getNextSearchParams(searchParams, paramKey, currentPage)} isActive>
                      {currentPage}
                    </PaginationLink>
                </PaginationItem>
                {currentPage + 1 < countOfPages &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }
                {currentPage + 1 <= countOfPages &&
                    <PaginationItem>
                        <PaginationLink href={getNextSearchParams(searchParams, paramKey, countOfPages)}>{countOfPages}</PaginationLink>
                    </PaginationItem>
                }
                {currentPage < countOfPages && 
                    <PaginationItem>
                        <PaginationNext href={getNextSearchParams(searchParams, paramKey, currentPage + 1)} />
                    </PaginationItem>
                }
            </PaginationContent>
        </PaginationRaw>
    )
}
