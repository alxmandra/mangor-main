import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';


import { useCallback, useEffect, useState, useRef, Key, ReactElement, KeyboardEvent, ChangeEvent, SetStateAction } from 'react';
import './responsiveTable.scss';
import { IColumn } from './dummyRows';

interface IcolumnsProps {
    columnIdx?: number
    columnId?: string
    showFilter: boolean
    showSort: boolean
}

interface IcellProps {
    cellFormatter: Function
}

interface IheadersProps {
    showHeader: boolean
    showRowNumber: boolean
    headerTemplate: ReactElement
    columnsProps: {
        [key: string]: IcolumnsProps
    }
}
interface IrowProps {
    showSelect: boolean
}
interface IToggleCallback {
    subject?: IColumn
    sorting: number
    filtering: number
    filteringValue: string
  }
interface IFiltering {
    [key: number | string]: IToggleCallback
  }
interface IresponsiveData {
    rowsOffset: number
    columns: Array<IColumn>
    dataSource: Function
    headerProps: IheadersProps
    cellProps: {
        [key: string]: Function
    }
    rowProps: IrowProps
    columnFormatter: Function
    filteringOptions: IFiltering
}
function ResponsiveTable({ rowsOffset, columns, dataSource, headerProps, cellProps, rowProps, columnFormatter, filteringOptions }: IresponsiveData) {

    const [rowsSource, setRowsSource] = useState<any>({});
    const tableRef = useRef<HTMLDivElement>(null);
    const scrollDirectionRef = useRef<string | null>(null);

    const [dataLength, setDataLength] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const [bottomAnchor, setBottomAnchor] = useState<null | HTMLDivElement>(null)
    const [middleAnchor, setMiddleAnchor] = useState<null | HTMLDivElement>(null)
    const [upAnchor, setUpAnchor] = useState<null | HTMLDivElement>(null)
    const refOffsetAdaptive = useRef(10)

    const rowsCalcRef = useRef(
        {
            previous: { start: 0, end: 0 },
            current: { start: 0, end: 0 },
            next: { start: 0, end: 0 }
        }
    )

    const getAnchor = useCallback((key = '', refSetter: (arg0: HTMLTableRowElement | null) => void, label = '', className = '') => (
        <tr key={key} ref={ref => refSetter(ref)}>
            <td colSpan={label ? columns.length + 2 : 0} className={`${className}`}>{label}</td>
        </tr>
    ), [columns.length])

    const [selectedRows, setSelectedRows] = useState<any[] | HTMLElement[] | ReactElement[]>([]);

    const toggleRowsCounter = useCallback(() => {
        let { current, previous, next } = rowsCalcRef.current;
        if (typeof dataLength !== 'number') {
            return
        }
        if ((scrollDirectionRef.current === 'bottom' && (current.end < dataLength)) || !scrollDirectionRef.current) {
            current.start = current.end - refOffsetAdaptive.current > 0 ? current.end - refOffsetAdaptive.current : 0
            const endTail = dataLength - current.end - refOffsetAdaptive.current
            current.end = current.end + (endTail >= refOffsetAdaptive.current? refOffsetAdaptive.current : dataLength - current.end)
        }
        if (scrollDirectionRef.current === 'up' && current.start > 0) {
            current.end = current.start <= refOffsetAdaptive.current && current.start !== 0 ? refOffsetAdaptive.current * 2 : current.start
            current.start = current.start - refOffsetAdaptive.current <= 0 ? 0 : current.start - refOffsetAdaptive.current
        }

        rowsCalcRef.current = { current, previous, next }
    }, [dataLength])

    const formatRows = () => {

        const cellFormatter = (cell: any, key: string) => {
            if (cellProps[key]) {
                return cellProps[key](cell, key)
            }
            return (
                <td key={key}>{cell}</td>
            )
        }
        const setRowSelected = (target: any, direction?: string) => {
            let localTarget = target
            let parent = target.parentNode as Element;
            while (parent.localName !== "tbody") {
                localTarget = parent;
                parent = localTarget.parentNode;

            }

            parent?.childNodes.forEach((n: any) => { n.classList.remove('row_active') })
            if (direction === 'ArrowDown' && target?.nextElementSibling) {
                localTarget = target?.nextElementSibling
                if (target?.nextElementSibling === middleAnchor) {
                    localTarget = target?.nextElementSibling.nextElementSibling;
                }
            }

            if (direction === 'ArrowUp' && target?.previousElementSibling) {
                localTarget = target?.previousElementSibling
                if (target?.previousElementSibling === middleAnchor) {
                    localTarget = target?.previousElementSibling.previousElementSibling

                }
            }
            localTarget.focus()
            localTarget.classList.add('row_active')
        }
        const keyPressHandler = (e: KeyboardEvent<HTMLTableRowElement>) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setRowSelected(e.nativeEvent.target, e.key);

            }
        }

        const mouseHandler = (e: any) => {
            setRowSelected(e.nativeEvent.target.parentNode)
        }
        const toggleSelection = (e: ChangeEvent<HTMLInputElement>, row: any) => {
            setSelectedRows(old => {
                const newState = [...old]
                if (!e.target.checked) {
                    const targetIndex = newState.findIndex((itm: any) => itm.id === row.id);

                    newState.splice(targetIndex, 1)
                }
                else {
                    newState.push(row)
                }
                return newState
            })
            setRowsSource((old: any) => {
                const newRows = { ...old }
                newRows[row.id].checked = e.target.checked
                return newRows
            })
        }

        const getRowCheckBox = (row: any) => {
            let rowBlueprint = (<Form.Check
                type={'checkbox'}
                onChange={e => { toggleSelection(e, row) }}
                checked={rowsSource[row.id]?.checked}
            />)
            return rowBlueprint
        }

const sortedRows = Object.values(rowsSource).sort((a: any,b: any) => a?.key - b?.key)

        return sortedRows.map((row: any, idx) => {

            return (
                <tr key={row.key} tabIndex={0} onKeyDown={e => { keyPressHandler(e) }} onClick={mouseHandler}>
                    {headerProps.showRowNumber && <td>{row.key}</td>}
                    {rowProps.showSelect && <td>
                        {getRowCheckBox(row)}
                    </td>}
                    {columns.map((column: any) => (
                        cellFormatter(row[column.id], column.id)
                    ))}
                </tr>
            )
        })

    }
    const _setRowsSource = useCallback((data: any) => {

        setRowsSource(data)
    }, [])
    const addKeyToRows = useCallback((data: any[], range: { start: any; }) => {
        const newRows: any = {}
        const ifSelected = (row: any) => {
            return selectedRows.findIndex((itm: any) => itm.id === row.id) > -1
        }

        data.forEach((itm: any, idx: any) => {
            newRows[itm.id] = itm;
            newRows[itm.id].checked = ifSelected(itm);
            newRows[itm.id].key = range.start + idx
        })
        return newRows
    }, [selectedRows])

    const getDisplayRows = useCallback(() => {
        setIsLoading(true)
        toggleRowsCounter();
        const { previous, next, current } = rowsCalcRef.current;
        const requestParams = {offset: current.start, limit: current.end - current.start}
        
        dataSource(requestParams).then((pagenatedData: { data: { rows: any[]; }; }) => {
            setIsLoading(false)
            _setRowsSource({
                ...addKeyToRows(pagenatedData.data.rows, current)
            })
        })
    }, [_setRowsSource, addKeyToRows, dataSource, toggleRowsCounter])

    useEffect(() => {

        rowsCalcRef.current = {
            previous: { start: 0, end: 0 },
            current: { start: 0, end: 0 },
            next: { start: 0, end: 0 }
        }
        scrollDirectionRef.current = null
        setBottomAnchor(null)
        setMiddleAnchor(null)
        refOffsetAdaptive.current = 10
        initStartedRef.current = false
        setIsLoading(true)
        setDataLength(null)
    }, [rowsOffset, filteringOptions])


    const addUpPortion = () => {
        getDisplayRows();
    }

    const addBottomPortion = useCallback(() => {
        getDisplayRows();
    }, [getDisplayRows])

    const initStartedRef = useRef(false);

    useEffect(() => {
        if (dataLength || !rowsOffset || initStartedRef.current) {
            return
        }
        setIsLoading(true)
        initStartedRef.current = true

        dataSource({ offset: 0, limit: rowsOffset }).then((resp: { totalLength: number, data: { count: number; rows: any[]; } }) => {


            // checking, if the offsetAdaptive (data chunk) respects the data sizing
            initStartedRef.current = false
            if (refOffsetAdaptive.current > resp.totalLength) {
                refOffsetAdaptive.current = resp.totalLength
            }
            // totalLength - is the bottom border for the data depth
            if (resp.data.count !== dataLength) {
                setDataLength(resp.data.count)
            }
            // adding initial data portion to table
            _setRowsSource({
                ...addKeyToRows(resp.data.rows, { start: 0 })
            })
        }).then(() => {
            setIsLoading(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataLength, rowsOffset])

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target as HTMLInputElement;

        if (scrollTop === 0) {
            // Scroll to top, load previous strings
            // Simulating an API call to fetch more strings
            if (!upAnchor) {
                return
            }
            scrollDirectionRef.current = 'up';
            addUpPortion()
            console.log('Loading previous strings...');

        } else if (scrollTop + clientHeight === scrollHeight) {
            if (!bottomAnchor) {
                return
            }
            scrollDirectionRef.current = 'bottom';
            addBottomPortion()
            // Scroll to bottom, load more strings
            // Simulating an API call to fetch more strings
            console.log('Loading more strings...');
        }
    };

    useEffect(() => {
        if (bottomAnchor && !isLoading && tableRef?.current &&
            bottomAnchor.getBoundingClientRect().top < tableRef?.current?.getBoundingClientRect()?.bottom &&
            rowsCalcRef.current.current.end !== dataLength && !scrollDirectionRef.current) {
            refOffsetAdaptive.current = (refOffsetAdaptive.current + rowsOffset)
            setTimeout(() => {
                addBottomPortion()
            })

        }

        if (scrollDirectionRef.current === 'up' && !isLoading) {
            setTimeout(() => {
                middleAnchor?.scrollIntoView()
            })
        }

    }, [addBottomPortion, dataLength, getAnchor, isLoading, rowsOffset, bottomAnchor, rowsSource, _setRowsSource, middleAnchor])

    const getRowsToDisplay = () => {
        let result: any[] = [];

        result = [...formatRows()]
        if (scrollDirectionRef.current) {
            if (scrollDirectionRef.current === 'bottom') {
            } else {
                result.splice(refOffsetAdaptive.current - 2, 0, getAnchor('middle', setMiddleAnchor, '', 'middle_anchor'))
            }
            
        }
        
        if (rowsCalcRef.current.current.start > 0) {
            result.unshift(getAnchor('up', setUpAnchor, 'Loading previous strings...'))
            
        }
        if (typeof dataLength === 'number' && rowsCalcRef.current.current.end < dataLength && dataLength > result.length) {
            result = [...result, getAnchor('down', setBottomAnchor, 'Loading more strings...')]
        }

        if (typeof dataLength === 'number' && !Object.keys(rowsSource)?.length) {
            result = [getAnchor('middle', setMiddleAnchor, 'No Data to display', 'center-text')]
        }
        return result
    }

    return (
        <div className="container pt-5">
            <div className="row">
                {headerProps.headerTemplate}
                <div className='responsiveTable' onScroll={(e: React.UIEvent<HTMLElement>) => { handleScroll(e) }} ref={tableRef}>
                    <Table responsive striped bordered>
                        <thead className='sticky'>
                            <tr className='tr_table'>
                                {headerProps.showHeader && <>
                                    {headerProps.showRowNumber && <th className='th_sticky btn-outline-secondary'>
                                        <div className='header_framing'>#</div>
                                    </th>}
                                    {rowProps.showSelect && <th className='th_sticky btn-outline-secondary'>
                                        <div className='header_framing'>
                                            <Form.Check
                                                type={'checkbox'}
                                                ref={(input: any) => {
                                                    if (input) {
                                                        input.indeterminate = true;
                                                    }
                                                }}
                                            />
                                        </div>
                                    </th>}
                                    {columns.map((column, index: Key | null | undefined) => (
                                        <th className='th_sticky btn-outline-secondary' key={index}>
                                            {columnFormatter(column)}
                                        </th>
                                    ))}</>}
                            </tr>
                        </thead>
                        <tbody>
                            {[...getRowsToDisplay()]}
                        </tbody>

                    </Table>

                </div>
                <div> Total: {dataLength} rows</div>
            </div>
        </div>
    );
}

export default ResponsiveTable;