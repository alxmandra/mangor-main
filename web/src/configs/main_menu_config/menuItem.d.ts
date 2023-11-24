export interface MenuItem {
    label: string,
    id: string|number,
    enabled?: boolean,
    class?: string
}

export interface MenuItems {
    [key: string]: MenuItem
}