export const errorResponseCreator = (field: string, message: string) =>(
    {
        errors: [{field, message}]
    }
)

export const errResponseCreator = (field: string, message: string) =>(
    {field, message}
)
