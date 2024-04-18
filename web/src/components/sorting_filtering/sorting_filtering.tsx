import { faMagnifyingGlass, faArrowUpWideShort, faShuffle, faArrowDownShortWide, faNotEqual, faListCheck, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect, useState } from 'react';
import { Dropdown, ButtonGroup, ToggleButton, InputGroup, Form, Button } from "react-bootstrap";
import { IColumn } from "../table/dummyRows";



interface IOption {
    label: string
    id: number
    icon: IconDefinition
}
interface IOptions {
    [key: number]: IOption
}
const filterOptions: IOptions = {
    0: {
        label: 'Contains',
        icon: faMagnifyingGlass,
        id: 0
    },
    1: {
        label: 'Exclude',
        icon: faNotEqual,
        id: 1
    },
    2: {
        label: 'Contains',
        icon: faListCheck,
        id: 2
    }
}
const sortingOptions: IOptions = {
    0: {
        label: 'Unordered',
        icon: faShuffle,
        id: 0
    },
    1: {
        label: 'ASC',
        icon: faArrowUpWideShort,
        id: 1
    },
    2: {
        label: 'DESC',
        icon: faArrowDownShortWide,
        id: 2
    }
}

interface IFilteringSorting {
    subject: IColumn
    showSorting?: boolean
    showFiltering?: boolean
    variant: string
    onToggle: Function
}

export const FilteringSorting = ({ subject, showSorting = false, showFiltering = false, variant, onToggle }: IFilteringSorting) => {
    const [sorting, setSorting] = useState(0);
    const [filtering, setFiltering] = useState(0);
    const [filteringValue, setFilteringValue] = useState("");
    const [isOpenned, setIsOpenned] = useState(false)

    return (
        <Dropdown className="filtering_sorting_options" autoClose="outside" onToggle={e => {
            if (isOpenned && e === false) {
                onToggle({ filteringValue, filtering, sorting, subject })
            }
            setIsOpenned(e)
        }}>
            <Dropdown.Toggle id="dropdown-autoclose-outside" variant={`outline-${variant}`} className='filtering_sorting_options'>
                <div className='filtering_dd_label'>
                    <div className='filtering_dd_label'>{subject.label}
                    </div>
                    <div className='filtering_sorting_button_footer'>
                        {showFiltering && <div className='filtering_sorting_button_label'>{filteringValue}
                        </div>}
                        <div>
                            {showSorting && <FontAwesomeIcon icon={sortingOptions[sorting].icon} />}
                        </div>
                        <div>
                            {showFiltering && <FontAwesomeIcon icon={filterOptions[filtering].icon} />}
                        </div>
                    </div>
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu variant={`outline-${variant}`}>
                <Dropdown.Item className='filtering_dropdown_item'>
                    {showSorting && <ButtonGroup>
                        {Object.values(sortingOptions).map(itm => (
                            <ToggleButton
                                key={itm.id}
                                id={itm.id}
                                value={itm.id}
                                checked={itm.id === sorting}
                                variant={itm.id === sorting ? variant : `outline-${variant}`}
                                size="sm"
                                onClick={() => {
                                    setSorting(itm.id)
                                }}>
                                <FontAwesomeIcon icon={itm.icon} />
                            </ToggleButton>
                        ))}
                    </ButtonGroup>}
                </Dropdown.Item>
                {showFiltering && showSorting && <Dropdown.Divider />}
                {showFiltering && <Dropdown.Item className='filtering_dropdown_item'>
                    <ButtonGroup aria-label="Basic example">
                        <Form.Control
                            placeholder={subject.label}
                            aria-label={subject.label}
                            type="text"
                            value={filteringValue}
                            onChange={e => { setFilteringValue((e.target as HTMLInputElement).value) }}
                            onKeyDown={e => {
                                if (e.key === ' ') {
                                    e.stopPropagation()
                                }
                            }}
                        />
                        <Button variant={`outline-${variant}`} onClick={() => setFilteringValue('')}>X</Button>
                    </ButtonGroup>


                    <ButtonGroup>
                        {Object.values(filterOptions).map(itm => (
                            <ToggleButton
                                key={itm.id}
                                id={itm.id}
                                value={itm.id}
                                checked={itm.id === filtering}
                                variant={itm.id === filtering ? variant : `outline-${variant}`}
                                size="sm"
                                onClick={e => { setFiltering(itm.id) }}>
                                <FontAwesomeIcon icon={itm.icon} />
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Dropdown.Item>}
            </Dropdown.Menu>
        </Dropdown>
    )
}

