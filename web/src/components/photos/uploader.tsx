import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalUserContext } from '../../context-providers/global-user-context';
import Button from 'react-bootstrap/Button';
import { Col, Container, Form, Modal, Row, Image, FloatingLabel } from 'react-bootstrap';
import './uploader.scss'
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { uploadImage } from '../../services/photoService';
import { MangorSpinner } from '../mangor_spinner/mangor_spinner';


export const Uploader = () => {

    const { t } = useTranslation();
    const { user } = useGlobalUserContext();
    const [show, setShow] = useState(false);
    const [currentImage, setCurrentImage] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [modalContent, setModalContent] = useState<ReactElement<any, any> | JSX.Element[] | null>(null)
    const formRef = useRef<any>(null)

    const [validated, setValidated] = useState(false);

    const handleSubmit = useCallback((event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(false);
            formRef.current.classList.toggle('was-validated')
            return;
        }
        formRef.current.classList.toggle('was-validated')
        setValidated(true);
        const data = new FormData(form);
        data.append('author_id', user?.email || '')

        event.preventDefault();
        event.stopPropagation();
        setUploading(true)
        uploadImage(data).then(() => {
            form?.classList?.toggle('was-validated')
            setValidated(false);
            setUploading(false)
            setCurrentImage(null)
        }).catch(e => {
            setUploading(false)
            console.log(e)
        })
    }, [user?.email]);
    const handleClose = () => {
        setShow(false);
        setModalContent(null)
    };
    const defaultUploaderLayout = useCallback(() => (<Container>
        {uploading &&
            <Row>
                <Col className='d-flex justify-content-center'>
                    <MangorSpinner size='xxx-large' spinnerText={t('Loading')} extraContent={
                        <>
                            <MangorSpinner size='xxx-large' spinnerText='.' animationPattern='flipTop' speed='6s' />
                            <MangorSpinner size='xxx-large' spinnerText='.' animationPattern='flipTop' speed='4s' />
                            <MangorSpinner size='xxx-large' spinnerText='.' animationPattern='flipTop' speed='2s' />
                        </>
                    } />
                </Col>
            </Row>
        }
        {!uploading && <Row>

            <Col xs={6} md={4}>

                <Image src={currentImage ? URL.createObjectURL(currentImage) : 'favicon2.ico'} rounded className='uploader_image_preview' />
            </Col>
            <Col xs={6} md={8}>
                <Form noValidate validated={validated} ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
                    <FloatingLabel
                        controlId="title"
                        label="Title"
                        className="mb-3"
                    >
                        <Form.Control name="title" type="text" required placeholder="Image Title" />
                        <Form.Control.Feedback type="invalid">
                            {t('Please, provide a title')}
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel controlId="file" label="Image" className="mb-3">
                        <Form.Control type="file" name="file" required placeholder="image" accept="image/png, image/gif, image/jpeg"
                            onChange={(e: any) => {
                                e.preventDefault();
                                if (e.target.files && e.target.files[0]) {
                                    setCurrentImage(e.target.files[0]);
                                }
                            }} />
                        <Form.Control.Feedback type="invalid">
                            {t('Please select a file.')}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="description"
                        label={`${t("File Description")}: `}
                        className="mb-3"
                    >
                        <Form.Control as="textarea" name="description" rows={2} required />
                        <Form.Control.Feedback type="invalid">
                            {t('Please add short description.')}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <Button
                        className="float-right"
                        type="submit"
                        variant={"outline-secondary"}
                        size="sm">
                        {t('Upload')}
                    </Button>
                </Form>
            </Col>
        </Row>}
    </Container>
    ), [currentImage, handleSubmit, t, uploading, validated])

    const generateDialogContent = useCallback(() => {
        setModalContent(defaultUploaderLayout)
    }
        , [defaultUploaderLayout])

    useEffect(() => {
        generateDialogContent();
    }, [generateDialogContent])

    const handleShow = () => {
        generateDialogContent();
        setShow(true)
    };

    return (<>
        <Button variant={"secondary"} onClick={handleShow} size="lg">
            <FontAwesomeIcon icon={faFileArrowUp} />
        </Button>

        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton className='mb-3'>
                <Modal.Title id="example-modal-sizes-title-lg">
                    {t('Upload New Image')}
                </Modal.Title>
            </Modal.Header>
            {modalContent}
        </Modal>
    </>
    );
}
