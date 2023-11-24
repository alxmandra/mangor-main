import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';

interface option {
    label: string
    class?: string
    id: string
}
interface DropdownToggler {
    label: string
    showBadge: boolean
    options: option[]
    onChange: Function
    currentOption: option
}

export const Toggler = (props: DropdownToggler) => {

    const { t } = useTranslation();

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {props.showBadge ? <Badge bg="secondary">{props.currentOption?.id || ''}</Badge> : null}
                    {' '}
                    {t(props.label)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {props.options.map(
                        (option: option): JSX.Element => (
                            <Dropdown.Item key={option.id} className={option?.id === props.currentOption?.id ? 'active' : ''}
                                onClick={(): void => {
                                    props.onChange(option)
                                }}>{t(option.label)}</Dropdown.Item>
                        )
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
