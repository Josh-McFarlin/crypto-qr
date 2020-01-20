import React from 'react';
import Router from 'next/router';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import { Card, CardHeader, CardBody, Row, Col, Button, ButtonGroup } from 'shards-react';
import firebase from '../../frontend/firebase';
import { getPage } from '../../frontend/firebase/actions/pages';
import AddressQRCode from '../../frontend/components/AddressList/QRCode';
import AddressListViewer from '../../frontend/components/AddressList/AddressListViewer';
import urls from '../../utils/urls';


const styles = (theme) => ({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 700
    },
    buttonGroup: {
        float: 'right'
    },
    qrHolder: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    holderUrl: {
        margin: `${2 * theme.spacing.unit}px 0`,
        width: '100%',
        wordBreak: 'break-all',
        textAlign: 'center'
    },
    fullHeight: {
        height: '100%'
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    flexFill: {
        flex: 1
    }
});

const ViewPage = () => {
    const [page, setPage] = React.useEffect(null);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [userId, setUserId] = React.useState(null);

    const { pageId } = Router.query;

    React.useEffect(() => {
        getPage(pageId)
            .then((newPage) => setPage(newPage));

        firebase.auth()
            .onAuthStateChanged((user) => {
                setUserId(user.uid);
            });
    }, []);

    const toggleModal = () => {
        setModalOpen((prevState) => !prevState);
    };

    const thisUrl = `${urls.base}${urls.qr.view(pageId)}`;

    const isOwner =
        has(page, 'owner')
        && isString(userId)
        && page.owner === userId;

    return (
        <Row className={classes.fullHeight}>
            <Col className={`${classes.fullHeight} ${classes.flexColumn}`}>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader className={classes.header}>
                                {get(page, 'data.title')}
                            </CardHeader>
                            <CardBody>
                                {(has(page, 'data.caption') && page.data.caption.length > 0) && (
                                    <p>
                                        {get(page, 'data.caption')}
                                    </p>
                                )}
                                <ButtonGroup className={classes.buttonGroup}>
                                    {isOwner && (
                                        <Button
                                            theme='primary'
                                            href={urls.qr.edit(pageId)}
                                        >
                                            Edit Page
                                        </Button>
                                    )}

                                    <Button
                                        theme='primary'
                                        onClick={toggleModal}
                                    >
                                        View QR
                                    </Button>
                                </ButtonGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className={classes.flexFill}>
                    <Col className={isMobile ? null : classes.fullHeight}>
                        <AddressListViewer
                            className={classes.fullHeight}
                            addresses={get(page, 'data.addresses', [])}
                        />

                        <AddressQRCode
                            modalOpen={modalOpen}
                            modalInfo={{
                                address: thisUrl,
                                coinType: 'Page'
                            }}
                            closeModal={toggleModal}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ViewPage;
