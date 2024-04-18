import React, { useEffect, useState } from 'react';
import './mangor_spinner.scss'

interface IMangorSpinner {
    size?: 'xxx-large' | 'xx-small' | 'inherit'
    extraClassName?: string
    extraContent?: string | React.ReactElement
    spinnerText?: string
    delay?: string
    speed?: string
    animationPattern?: 'flipTop' | 'rotate' | 'default'
}
export const MangorSpinner = ({ size = 'inherit', extraClassName, extraContent, spinnerText = 'MANGOR', delay = '3s', speed='6s', animationPattern }: IMangorSpinner) => {
const defaultLayout = (
    <span className={`spinner-container ${extraClassName}`} style={{ fontSize: size }}>
            <span
                className="flip-animate">
                {spinnerText[0]}
                {spinnerText[1] && <span className="flipTop" style={{animationDelay: delay, animationDuration: speed }}>{spinnerText[1]}</span>}
                {spinnerText[2]}
                {spinnerText[3] && <span className="rotate">{spinnerText.slice(3,6)}</span>}
                {spinnerText[6] && <span>{spinnerText.slice(6)}</span>}
            </span>
            {extraContent}
        </span>
)
    const [layout, setLayout] = useState(defaultLayout)

    useEffect(() => {
        
        if (!animationPattern || animationPattern === 'default') {
            return
        }
        
        setLayout(
            <>
            {<span className={animationPattern} style={{animationDelay: delay, animationDuration: speed}}>{spinnerText}</span>}
            </>
        )
    }, [animationPattern, delay, speed, spinnerText])
    return (
    <>
    {layout}
    </>
    )
}
