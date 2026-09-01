import { Link } from 'react-router-dom';

// Reusable breadcrumb trail. Each item is `{ label, to? }`; the last item (the
// current page) always renders as plain text even if it has a `to` - everything
// before it renders as a Link when `to` is given, plain text otherwise.
const Breadcrumbs = ({ items }) => (
  <div className="breadcrumbs">
    {items
      .map((item, index) => {
        const isCurrent = index === items.length - 1;
        const content = item.to && !isCurrent ? <Link to={item.to}>{item.label}</Link> : item.label;
        return <span key={`${item.label}-${index}`}>{content}</span>;
      })
      .reduce((trail, crumb, index) => (index === 0 ? [crumb] : [...trail, ' > ', crumb]), [])}
  </div>
);

export default Breadcrumbs;
