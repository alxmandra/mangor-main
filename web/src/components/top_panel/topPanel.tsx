import React, { useCallback, useEffect, useState } from "react";
import { MenuItems } from "../../configs/main_menu_config/menuItem";
import menuItems from "../../configs/main_menu_config/config";
import { Toggler } from "../toggler/Toggler";
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import translations from '../../configs/translation/translations';
import themes from '../../configs/theme/themes';
import i18n from '../../i18n';
import { Row } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { myself } from '../../services/authService';
import "./topPanel.scss"


import Col from 'react-bootstrap/Col';
import { Authentication } from "../authenticate/authentication";
import { useGlobalUserContext } from "../../context-providers/global-user-context";
import { MangorSpinner } from "../mangor_spinner/mangor_spinner";
const myMenu: MenuItems = menuItems;
interface option {
    label: string
    class?: string
    id: string
}

interface UserProps {
    [key: string]: string
}
export const TopPanel = () => {
    const [currentLanguage, setCurrentLanguage] = useState(translations[0]);
    const [currentTheme, setCurrentTheme] = useState(themes[0]);
    const { user, setUser } = useGlobalUserContext();
    const { t } = useTranslation();
    const [menuItems, setMenuItems] = useState<MenuItems>(myMenu)

    const authSyncListener = (event: any) => {
        myself(event['detail'].token).then(user => {
            const { email, firstName, lastName, username } = user.data
            setUser({ email, firstName, lastName, username })
        }).catch(
            () => {
                localStorage.removeItem('token')
                setUser(null)
            }
        )
    }

    useEffect(() => {
        setMenuItems(myMenu);
        if (user) {
            setMenuItems(old => (
                {...old, 
                    test: {
                        label: "users",
                        id: "users"
                    }
                }
            ));
        }
    }, [user])

    const changeLanguage = useCallback((langId?: string) => {
        let lang = translations[0];
        if (langId) {
            lang = translations.filter(tr => (tr.id === langId))[0]
        }
        i18n.changeLanguage(lang.id); //change the language
        setCurrentLanguage(lang)
    }, [])
    
    const changeTheme = useCallback((themeId?: string) => {
        let theme = themes[0];
        if (themeId) {
            theme = themes.filter(th => (th.id === themeId))[0]
        }
        setCurrentTheme(theme)
        document.documentElement.setAttribute('data-bs-theme', theme.id);
    }, [])

    const getUserPreferencies = () => {
        const userProps = localStorage.getItem("userProps");
        let userPreferencies = {} as UserProps
        if (userProps) {
            userPreferencies = { ...JSON.parse(userProps) }
        }
        return userPreferencies
    }
    const saveUserPreferencies = (id: string, val: string) => {
        const userProps = getUserPreferencies();
        const newProps = { ...userProps, [id]: val }
        localStorage.setItem('userProps',
            JSON.stringify(
                newProps
            )
        )
    }
    useEffect(() => {
        const userPreferencies = getUserPreferencies();
        changeLanguage(userPreferencies.userLang);
        changeTheme(userPreferencies.userTheme);
        window.removeEventListener('mangor::authentication', authSyncListener);
        window.addEventListener('mangor::authentication', authSyncListener);
        const token = localStorage.getItem("token");
        if (token) {
            authSyncListener({ detail: { token } })
        }
        return () => {
            window.removeEventListener('mangor::authentication', authSyncListener);
        }
    }, [])

    const HandleLanguageChange = (langId: string) => {
        changeLanguage(langId)
        saveUserPreferencies("userLang", langId)
    }
    const handleThemeChange = (themeId: string) => {
        changeTheme(themeId);
        saveUserPreferencies("userTheme", themeId)
    }
    return (
        <Navbar bg={currentTheme.id} expand="lg" className={"bg-body-tertiary"} fixed="top">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand href="#home">
                        <Container>
                            <Row>
                                <Col>
                                    <img
                                        alt=""
                                        src={currentTheme.id === 'dark' ? "/favicon2.ico" : "/favicon.ico"}
                                        width="48"
                                        height="32"
                                        className="d-inline-block align-top"
                                    />
                                </Col>
                                <Col>
                                
                                <MangorSpinner/>
                                    
                                </Col>
                            </Row>
                        </Container>
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto nav nav-pills flex-row" >
                        {Object.values(menuItems).map((menuItem, idx: number) => (
                            <LinkContainer to={`/${menuItem.id}`} key={menuItem.id} >
                                <a className="nav-link" href={`/${menuItem.id}`} >{t(menuItem.label) || "Missing label"}</a>
                            </LinkContainer>
                        ))}
                    </Nav>
                    <Row>
                        <Col className="md-4">
                            <Authentication />
                        </Col>
                        <Col className="md-1">
                            <Toggler currentOption={currentLanguage} onChange={(e: option) => { HandleLanguageChange(e.id) }} label={t("Language")} options={translations} showBadge={true} />
                        </Col>
                        <Col className="md-4">
                            <Toggler currentOption={currentTheme} onChange={(e: option) => { handleThemeChange(e.id) }} label={t("Theme")} options={themes} showBadge={false} />
                        </Col>
                    </Row>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}