import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import _ from 'lodash';
import {
    Card, CardBody, CardHeader, Row, Col, Button, ButtonGroup
} from 'shards-react';
import { isMobile } from 'react-device-detect';

import AddressQRCode from '../frontend/components/AddressList/QRCode';
import AddressListViewer from '../frontend/components/AddressList/AddressListViewer';
import Error from './_error';
import urls from '../utils/urls';
import { fetchPage } from '../frontend/firebase/actions';
import LoadingCardBody from '../frontend/components/LoadingElements/LoadingCardBody';


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

class ViewPage extends React.PureComponent {
    static async getInitialProps({ query }) {
        const postId = _.get(query, 'id');

        return fetchPage(postId)
            .then((page) => ({
                page,
                postId,
                newPage: false
            }))
            .catch(() => ({
                goToError: true
            }));
    }

    constructor(props) {
        super(props);

        if (_.isObject(_.get(props, 'page.data'))) {
            this.state = {
                modalOpen: false
            };
        } else {
            this.state = {
                error: {
                    statusCode: 404,
                    statusMessage: 'QR Page Not Found :('
                },
                modalOpen: false
            };
        }
    }

    toggleModal = () => {
        this.setState((prevState) => ({
            modalOpen: !prevState.modalOpen
        }));
    };

    render() {
        const { classes, page, postId, user } = this.props;
        const { error, modalOpen } = this.state;

        if (_.has(error, 'statusCode')) {
            return (
                <Error
                    statusCode={error.statusCode}
                    statusMessage={error.statusMessage}
                />
            );
        }

        const thisUrl = `https://coinqr.io${urls.qr.view(postId)}`;

        const isOwner =
            _.has(page, 'owner')
            && _.has(page, 'owner')
            && _.has(user, 'uid')
            && page.owner === user.uid;

        return (
            <Row className={classes.fullHeight}>
                <Col className={`${classes.fullHeight} ${classes.flexColumn}`}>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader className={classes.header}>
                                    {page.data.title}
                                </CardHeader>
                                <LoadingCardBody isLoading={_.isNil(page) || _.isNil(user)}>
                                    {(_.has(page, 'data.caption') && page.data.caption.length > 0) && (
                                        <p>
                                            {page.data.caption}
                                        </p>
                                    )}
                                    <ButtonGroup className={classes.buttonGroup}>
                                        {isOwner && (
                                            <Button
                                                theme='primary'
                                                href={urls.qr.edit(postId)}
                                            >
                                                Edit Page
                                            </Button>
                                        )}

                                        <Button
                                            theme='primary'
                                            onClick={this.toggleModal}
                                        >
                                                View QR
                                        </Button>
                                    </ButtonGroup>
                                </LoadingCardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row className={classes.flexFill}>
                        <Col className={isMobile ? null : classes.fullHeight}>
                            <AddressListViewer
                                className={classes.fullHeight}
                                addresses={page.data.addresses}
                            />

                            <AddressQRCode
                                modalOpen={modalOpen}
                                modalInfo={{
                                    address: thisUrl,
                                    coinType: 'Page'
                                }}
                                closeModal={this.toggleModal}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

ViewPage.propTypes = {
    classes: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired
};

export default withRouter(withStyles(styles)(ViewPage));
