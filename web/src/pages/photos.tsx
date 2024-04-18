import React from "react";
import { useState } from 'react';
import ResponsiveTable from "../components/table/responsiveTable";
import { IColumn, columns } from '../components/table/dummyRows';
import { FilteringSorting } from '../components/sorting_filtering/sorting_filtering'
import { Button } from "react-bootstrap";
import { Uploader } from "../components/photos/uploader";
import { getSomeImages } from "../services/photoService";
import './photos.scss';
export const Photos = () => {
  interface IToggleCallback {
    subject?: IColumn
    sorting: number
    filtering: number
    filteringValue: string
  }
  interface IFiltering {
    [key: number | string]: IToggleCallback
  }
  const [filteringOptions, setFilteringOptions] = useState<IFiltering>({});

  const getData = (params: any) => {
    let rOptions = {...filteringOptions}
    Object.keys(rOptions).forEach((key) => {
      const {filtering, filteringValue, sorting} = filteringOptions[key]
      rOptions[key] = {filtering, filteringValue, sorting}
    })
    const queryParams = {...params, filteringOptions:rOptions, dimension: 'compressed'};
    return getSomeImages(queryParams).then((resp) => {
      return resp.data
    })

  }
  const cellFormatter = (cell: any, idx: React.Key | null | undefined) => {
    return (<td key={idx}>hello, {cell}</td>)
  }

  const onToggle = (e: IToggleCallback) => {
    setFilteringOptions((oldOptions) => {
      let newOptions = { ...oldOptions };
      if (e?.subject) {
        newOptions[e?.subject?.id] = {
        subject: e.subject,
        sorting: e.sorting,
        filtering: e.filtering,
        filteringValue: e.filteringValue
      }
      }
      
      return newOptions
    })
  }

  const columnFormatter = (column: IColumn) => {
    if (column?.showFiltering || column?.showSorting) {
      return (
        <FilteringSorting
          subject={column}
          showSorting={column?.showSorting}
          showFiltering={column?.showFiltering}
          variant={"secondary"}
          onToggle={onToggle} />
      )
    }
    return (
      <Button
        variant={"outline-secondary"}
        className="filtering_sorting_options"
      >
        {column.label}
      </Button>)

  }
  const headerTemplate = (<div>
    
    <div>
    
    <h1>Photos</h1>

    </div>

    <div>
      <Uploader></Uploader>
    </div>

    </div>)
  const headerProps = {
    showHeader: true,
    showRowNumber: true,
    headerTemplate,
    columnsProps: {
      '1': {
        showFilter: true,
        showSort: true
      }
    }
  }

  const toBase64 = (arr: any[]) => {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
       arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
 }

  const imageCellFormatter = (imgItm: { data: any[]; }, key: string) => {
    return (
      <td key={key}>
        <div  className="image_cell" style={{background: `url(data:image/png;base64,${toBase64( imgItm.data)}) no-repeat center`,   animation: `kenny 60s linear`, animationIterationCount: 'infinite'}}/>
      </td>
      
    )
  }

  const cellProps = {
    'author': cellFormatter,
    'data': imageCellFormatter
  }
  const rowProps = {
    showSelect: true
  }

  return (
    <>{<ResponsiveTable
      rowProps={rowProps}
      rowsOffset={5}
      dataSource={getData}
      columns={columns}
      headerProps={headerProps}
      cellProps={cellProps}
      columnFormatter={columnFormatter}
      filteringOptions={filteringOptions}
    />}
    </>
  )
}

