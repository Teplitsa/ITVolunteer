import { ReactElement } from "react";


const Header: React.FunctionComponent = ({ children }): ReactElement => {
  //const user = useStoreState((store) => store.user.data);
  const gaContent = `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-39184963-27', 'auto');
ga('send', 'pageview');
`;

  return (
    <header id="site-header" className="site-header">
      {children}
      <script dangerouslySetInnerHTML={{ __html: gaContent }}></script>
    </header>
  );
};

export default Header;
