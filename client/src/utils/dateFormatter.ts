import format from "date-fns/format"

const dateFormatter = (date: string) => {
    return format(new Date(parseInt(date)), 'dd MMM yyyy')
}

export default dateFormatter
