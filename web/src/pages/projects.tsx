import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { MangorCard } from "../components/card/card";
import './projects.scss'
import { Animated } from "../components/lotties/lottie";
import { useMediaQuery } from '../custom-hooks/mediaQuery'
const tiles = [
    {
        id: 'projects',
        title: 'Projects',
        descriptionHeader: 'Check Out',
        descriptionText: 'Event company'
    },
    {
        id: 'services',
        title: 'Services',
        descriptionHeader: 'Technica Light & Sound',
        descriptionText: 'Event company'
    },
    {
        id: 'branding',
        title: 'Branding',
        descriptionHeader: 'Check Out',
        descriptionText: 'Event company'
    },
    {
        id: 'tech',
        title: 'Tech Touch',
        descriptionHeader: 'Check Out',
        descriptionText: 'Event company'
    },
    {
        id: 'games',
        title: 'Games',
        descriptionHeader: 'Check Out',
        descriptionText: 'Event company'
    },
    {
        id: 'about',
        title: 'About Us',
        descriptionHeader: 'Check Out',
        descriptionText: 'Event company'
    }
]
const colorBase = {
    'r': 'red',
    'b': 'cornflowerblue',
    'p': 'pink',
    'o': 'orange',
    'g': 'darkseagreen',
    'a': 'deepskyblue',
    'c': 'cornsick',
    'd': 'DarkSlateGray',
    'e': 'crimson',
    's': 'lightcoral',
    't': 'thistle'
}

const getColor = (e: string) => {
    let result = 'gray'
    return colorBase[e as unknown as keyof typeof colorBase] || result
}
export const Projects = () => {
    const [currentTile, setCurrentTile] = useState<string>()
    const [showLogo, setShowLogo] = useState<string[]>([])
    const [localGrid, setLocalGrid] = useState<HTMLDivElement | null>(null)
    const [gridStructure, setGridStructure] = useState<string>(
        `
        "cell-0 cell-1 cell-2" 
        "cell-3 cell-1 cell-4"
        "cell-5 cell-5 cell-4"
        `
    )

    const isRowBased = useMediaQuery('(min-width:992px)');
    const handleClick = () => {
        if (!localGrid) {
            return;
        }
        localGrid.classList.toggle('grid--full')
    }
    const gridLayoutStructure = {
        gridStructure: (isRowBased: any) => {
            if (isRowBased) {
                return gridStructure
            }
            else return (
                `
        "cell-0 cell-0 cell-0"
        "cell-1 cell-1 cell-1 "
        "cell-2 cell-2 cell-2 "
        "cell-3 cell-3 cell-3 "
        "cell-4 cell-4 cell-4 "
        "cell-5 cell-5 cell-5 "
        `
            )
        }
    }
    useEffect(() => {
        if (!localGrid) {
            return
        }
        setTimeout(() => {
            console.log('register grid layout', localGrid)
            /* setGridStructure(
                `"cell-0 cell-1 cell-2"
                "cell-3 cell-3 cell-2"
                "cell-4 cell-5 cell-6"`
            ) */



        }, 3000)
    },
        [localGrid])
    const deleteCurrentTile = (tileId: string) => {
        setShowLogo((old) => {
            const newLogos = [...old];
            newLogos.splice(newLogos.indexOf(tileId), 1)
            return newLogos
        })
    }

    const getParentElement = (el: HTMLElement, parentSelector: string) => {
        let baseElement = null;
        let localElement = el;
        while (!baseElement || localElement) {
            if (localElement.classList.contains(parentSelector)) {
                baseElement = localElement
            }
            localElement = localElement.parentElement as HTMLElement;
        }
        return baseElement
    }

    const _setCurrentTile = (tileId: string, e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (showLogo.includes(tileId)) {
            return
        }
        const target = e?.target as HTMLElement;
        if (target instanceof HTMLElement) {
            let baseElement = getParentElement(target, 'item_base');
            if (baseElement) {
                if (baseElement.classList.contains('div-size')) {
                    return
                }
            }
        }
        setShowLogo((old) => {
            const newLogos = [...old];
            newLogos.push(tileId)
            return newLogos
        })
    }

    const divSelect = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, tileId: string) => {
        const { target } = e;
        if (target instanceof HTMLDivElement) {
            let baseElement = getParentElement(target, 'item_base');
            if (baseElement) {
                baseElement.classList.toggle('div-size')
                baseElement.classList.toggle('item')
                if (baseElement.classList.contains('div-size')) {
                    deleteCurrentTile(tileId)
                } else {
                    _setCurrentTile(tileId)
                }
            }
        }
    }

    return (
        <>
            <style>
                {`
          .grid_transitiooning:hover {
          animation-play-state: paused;
          }
          .grid_transitiooning {
          animation: resize 1s ease 1 both;
          //transition-delay: 3s;
          //animation-duration: 10s;
          }
          @keyframes slide {      
              100% {     
                grid-template-areas: ${gridStructure}; 
              } 
            }
            
            @keyframes resize {
  0% {
    grid-template-columns: 2fr 2fr 2fr;
    grid-template-rows: 2fr 2fr 2fr;
  }
  
  25% {
    grid-template-columns: 2fr 2fr 3fr;
    grid-template-rows: 2fr 2fr 3fr;
  }
  
  50% {
    grid-template-columns: 2fr 3fr 2fr;
    grid-template-rows: 2fr 3fr 2fr;
  }
   /*
  75% {
    grid-template-columns: 3fr 2fr 2fr;
    grid-template-rows: 3fr 2fr 2fr;
  }
   */
  100% {
    grid-template-columns: 3fr 3fr 3fr;
    grid-template-rows: 3fr 3fr 3fr;
    animation-play-state: paused;
          }
  }
}
          `  }
            </style>
            <div className="container p-5">
                <div className="row">
                    <div className="col">

                        <div className="grid js-grid container grid_transitiooning p-3" ref={(lRef) => setLocalGrid(lRef)}>
                            {tiles.map((tile, idx) => (
                                <div key={tile.id} className={` item item_base tile_container `}
                                    style={
                                        {
                                            backgroundColor: getColor(tile.title[0].toLowerCase()),
                                            gridArea: `cell-${idx}`
                                        }
                                    }
                                    onMouseEnter={(e) => { _setCurrentTile(tile.id, e); console.log(tile.id, 'tile.id') }}
                                    onMouseLeave={() => { deleteCurrentTile(tile.id) }}
                                    onClick={(e) => divSelect(e, tile.id)}
                                >

                                    <div className="row">
                                        <h2>{tile.title}</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-3">
                                            {showLogo.includes(tile.id) ?
                                                <div className="tile_image_faded_wrapper">
                                                    <Animated animation={tile.id} className="tile_image_faded" height={100} width={100} ></Animated>
                                                </div>
                                                : null}
                                        </div>
                                        <div className="col-6">
                                            <div className="description">
                                                <h2>{tile.descriptionHeader}</h2>
                                                <p>{tile.descriptionText}</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="hover_base item_base"

                                    >
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}