import React from 'react';
import { Link } from 'gatsby';

import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <Container type="content">
        <p>Coronavirus</p>
        <ul>
          <li>
            <Link to="/">World</Link>
          </li>
          <li>
            <Link to="/page-2/">United States</Link>
          </li>
        </ul>
      </Container>
    </header>
  );
};

export default Header;
