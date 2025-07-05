import { DateTime } from 'luxon'

export function convertDateToString(timestamp: string) {
    return DateTime.fromISO(timestamp).toFormat('ccc, MMM d yyyy, h:mm a')
}

export interface PaginatedDocument<T> {
    docs: T[]
    totalDocs: number
    limit: number
    totalPages: number
    page: number | null
    pagingCounter: number | null
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
}