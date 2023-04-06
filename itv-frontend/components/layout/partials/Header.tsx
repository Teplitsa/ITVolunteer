import { ReactElement } from "react";

const Header: React.FunctionComponent = ({ children }): ReactElement => {
    //const user = useStoreState((store) => store.user.data);
    const gaContent = `
window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-D5XJZ7G6NG');
`;

    return (
        <header id="site-header" className="site-header">
            {children}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-D5XJZ7G6NG"></script>
            <script dangerouslySetInnerHTML={{ __html: gaContent }}></script>
        </header>
    );
};

export default Header;
