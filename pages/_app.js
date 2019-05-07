import React from 'react';
import PropTypes from 'prop-types';
import App, { Container as AppContainer } from 'next/app';
import Head from 'next/head';
import JssProvider from 'react-jss/lib/JssProvider';
import withStyles, { ThemeProvider } from 'react-jss';
import { Container } from 'shards-react';
import MobileDetect from 'mobile-detect';

import PageContext from '../frontend/utils/pageContext';
import NavBar from '../frontend/components/NavBar/NavBar';
import 'bootstrap-css-only';
import 'shards-ui/dist/css/shards.min.css';


const styles = (theme) => ({
    content: {
        flex: 1,
        overflow: 'hidden auto',
        padding: `${2 * theme.spacing.unit}px ${2 * theme.spacing.unit}px 0 ${2 * theme.spacing.unit}px`
    }
});

class AppContent extends React.PureComponent {
    render() {
        const { classes, Component, pageContext, pageProps, isMobile } = this.props;

        return (
            <React.Fragment>
                <NavBar />
                <Container
                    className={classes.content}
                    fluid
                >
                    <Component
                        pageContext={pageContext}
                        isMobile={isMobile}
                        {...pageProps}
                    />
                </Container>
            </React.Fragment>
        );
    }
}

AppContent.propTypes = {
    classes: PropTypes.object.isRequired,
    Component: PropTypes.any.isRequired,
    pageContext: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired
};

const StyledContent = withStyles(styles)(AppContent);

export default class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        const md = ctx.req ? new MobileDetect(ctx.req.headers['user-agent']) :
            new MobileDetect(navigator.userAgent);

        const isMobile = md.mobile() != null;

        return {
            pageProps,
            isMobile
        };
    }

    constructor(props) {
        super(props);

        this.pageContext = PageContext();
    }

    componentDidMount() {
        const style = document.getElementById('server-side-styles');

        if (style) {
            style.parentNode.removeChild(style);
        }
    }

    render() {
        const { Component, pageProps, isMobile } = this.props;

        return (
            <AppContainer>
                <Head>
                    <title>CryptoQR</title>
                </Head>
                <JssProvider
                    registry={this.pageContext.sheetsRegistry}
                    generateClassName={this.pageContext.generateClassName}
                >
                    <ThemeProvider theme={this.pageContext.theme}>
                        <StyledContent
                            Component={Component}
                            pageContext={this.pageContext}
                            pageProps={pageProps}
                            isMobile={isMobile}
                        />
                    </ThemeProvider>
                </JssProvider>
            </AppContainer>
        );
    }
}
