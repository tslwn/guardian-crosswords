/** @jsx jsx */
import { Styled, jsx } from 'theme-ui';
import React from 'react';
import 'normalize.css';

const Layout: React.FC = ({ children }) => {
  return (
    <Styled.root>
      <div
        sx={{
          fontFamily: `body`,
          margin: `0 auto`,
          maxWidth: 960,
          padding: 3,
          paddingTop: 0
        }}
      >
        <main>{children}</main>
      </div>
    </Styled.root>
  );
};

export default Layout;
