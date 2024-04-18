import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import "./carousel.scss"
import { getSomeImages } from "../../services/photoService";
import { MangorCard } from "../card/card";


export const MangorCarousel = () => {
    const [images, setImages] = useState <any>([])
    useEffect(() => {
        getSomeImages({limit:3, dimension: 'preview'}).then((resp: any) => {
            setImages(resp.data?.data?.rows || [])
        }
        )
    }, [])
    const toBase64 = (arr: any[]) => {
        return btoa(
           arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
     }
    return (
        <div className="mangor_carousel_wrapper">
            <Carousel fade>
                {images.map( (imgItm: { title: string; description: string; data: { data: any[]; }; }, idx:number) => (
                    <Carousel.Item key={idx}>
                        <MangorCard title={imgItm.title} text={imgItm.description} />
                        <div className="image_bordered" style={{background: `url(data:image/png;base64,${toBase64( imgItm.data.data)}) no-repeat center`,   animation: `kenny 60s linear`, animationIterationCount: 'infinite'}}> 
                        </div>
                </Carousel.Item>
                ))}
            </Carousel>
        </div>
    )
}