import { Card } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => (
  <Card>
    <div className="gx-page-error-container">
      <div className="gx-page-error-content">
        <div className="gx-error-code gx-mb-4">404</div>
        <h2 className="gx-text-center">
          Oops, an error has occurred. Page not found!
        </h2>
        <p className="gx-text-center">
          <Link className="gx-btn gx-btn-primary" to="/">
            Home
          </Link>
        </p>
      </div>
    </div>
  </Card>
);

export default Error404;
