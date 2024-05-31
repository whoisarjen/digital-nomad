import {
    Pagination as PaginationRaw,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { getCurrentPageNumber, getNextSearchParams, getNextSearchParamsWithoutSelectedKey, SEARCH_PARAM_KEY_PAGINATION } from "@/utils/link.utils"

type PaginationProps = {
    countOfPages: number
    searchParams: URLSearchParams
}
  
export function Pagination({
  countOfPages: countOfPagesRaw,
  searchParams,
}: PaginationProps) {
    const countOfPages = Math.ceil(countOfPagesRaw)
    const currentPage = getCurrentPageNumber(searchParams)

    return (
        <PaginationRaw>
            <PaginationContent>
                {currentPage > 1 &&
                    <PaginationItem>
                        <PaginationPrevious
                            href={currentPage - 1 === 1
                                ? getNextSearchParamsWithoutSelectedKey(searchParams, 'page')
                                : getNextSearchParams(searchParams, SEARCH_PARAM_KEY_PAGINATION, currentPage - 1)}
                        />
                    </PaginationItem>
                }
                {currentPage - 1 > 0 &&
                    <PaginationItem>
                        <PaginationLink href={getNextSearchParamsWithoutSelectedKey(searchParams, 'page')}>1</PaginationLink>
                    </PaginationItem>
                }
                {currentPage - 2 > 0 &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }
                <PaginationItem>
                    <PaginationLink href={getNextSearchParams(searchParams, SEARCH_PARAM_KEY_PAGINATION, currentPage)} isActive>
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
                        <PaginationLink href={getNextSearchParams(searchParams, SEARCH_PARAM_KEY_PAGINATION, countOfPages)}>{countOfPages}</PaginationLink>
                    </PaginationItem>
                }
                {currentPage < countOfPages && 
                    <PaginationItem>
                        <PaginationNext href={getNextSearchParams(searchParams, SEARCH_PARAM_KEY_PAGINATION, currentPage + 1)} />
                    </PaginationItem>
                }
            </PaginationContent>
        </PaginationRaw>
    )
}
