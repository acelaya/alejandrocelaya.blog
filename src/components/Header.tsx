import { LeftMenuItems } from './menu/LeftMenuItems';
import { RightMenuItems } from './menu/RightMenuItems';

const Header = () => (
  <section id="fh5co-header">
    <div className="container">
      <nav role="navigation">
        <ul className="pull-left left-menu">
          <LeftMenuItems />
        </ul>
        <ul className="pull-right right-menu header-icons">
          <RightMenuItems />
        </ul>
      </nav>
    </div>
  </section>
);

export default Header;
