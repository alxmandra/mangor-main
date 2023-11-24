import React, { ReactElement, Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalUserContext } from '../../context-providers/global-user-context';
import { logout } from '../../services/authService';
import Button from 'react-bootstrap/Button';
import './authentication.scss'
import { Modal } from 'react-bootstrap';

export const Authentication = () => {

    const { t } = useTranslation();
    const { user, setUser } = useGlobalUserContext();
    const [show, setShow] = useState(false);

    const [modalContent, setModalContent] = useState<ReactElement<any, any> | JSX.Element[] | null>(null)
    const handleClose = () => {
        setShow(false);
        setModalContent(null)
    };

    const logoutMe = useCallback(() => {
        logout().then(() => {
            setUser(null);
            localStorage.removeItem('token');
        });
    }, [setUser])

    const generateDialogContent = useCallback(() => {
        if (!user) {
            const Auth = React.lazy(() =>
                import('../foreign_modules/auth_from_angular')
                    .then(({ AuthenticationNg }) => ({ default: AuthenticationNg }))
            );
            setModalContent(
                <Suspense fallback={<div>{`${t('Loading')}...`}</div>}>
                    <Auth />
                </Suspense>
            )
        } else {
            setModalContent(() => {
                const result =
                    Object.keys(user!).map((attr) => (
                        <div className='form-group' key={attr}>
                            <fieldset disabled>
                                <label className="form-label" htmlFor={attr}>{`${attr}:`}</label>
                                <input className="form-control" id={attr} type="text" placeholder={user![attr]} disabled></input>
                            </fieldset>
                        </div>

                    ))
                result.push(<div className='container d-flex flex-row justify-content-end p-2' key={'logout'}>
                    <Button variant="primary" onClick={logoutMe} size="sm">{'LogOut'}</Button>
                </div>)
                return result
            })
        }
    }, [logoutMe, t, user])
    useEffect(() => {
        generateDialogContent();

    }, [generateDialogContent, user])
    const handleShow = () => {
        generateDialogContent();
        setShow(true)
    };
    return (<>
        <Button variant="secondary" onClick={handleShow}>
            {user ? user.username : t('Login')}
        </Button>

        <Modal show={show} onHide={handleClose}>
            {modalContent}
        </Modal>
    </>
    );
}
