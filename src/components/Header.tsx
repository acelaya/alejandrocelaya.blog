import type { FC } from 'react';
import { LeftMenuItems } from './menu/LeftMenuItems';
import { RightMenuItems } from './menu/RightMenuItems';
import type { Categories } from '../utils/posts';

export type HeaderProps = {
  categories: Categories;
}

const Header: FC<HeaderProps> = ({ categories }) => (
  <section id="fh5co-header">
    <div className="container">
      <nav role="navigation">
        <ul className="pull-left left-menu">
          <LeftMenuItems categories={categories} />
        </ul>
        <ul className="pull-right right-menu header-icons">
          <RightMenuItems />
        </ul>
      </nav>
    </div>
  </section>
);

export default Header;
