export interface IColumn {
    id:string | number
    label: string
    showSorting?: boolean
    showFiltering?: boolean
  }
export const columns: Array<IColumn> = [
    {
        id:'id',
        "label": "id"
    },
    {id: 'author',
        showSorting: true,
        showFiltering: true,
        "label": "author"
    },
    {
        id:'title',
        showSorting: true,
        showFiltering: true,
        "label": "title"
    },
    {id:'description',
        showSorting: true,
        showFiltering: true,
        "label": "description"
    },
    {id:'createdAt',
        "label": "createdAt"
    },
    {id: 'data',
        "label": "image"
    }
]
